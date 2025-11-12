// FIX: Add minimal type definitions for Cloudflare Workers environment to resolve compilation errors.
// These types are provided by the Cloudflare environment at runtime.
interface KVNamespace {
  get(key: string, options?: { type?: 'json' }): Promise<any>;
  put(key: string, value: string): Promise<void>;
}

interface EventContext<Env> {
  request: Request;
  env: Env;
  params: {
    path: string[];
  };
}

type PagesFunction<Env> = (context: EventContext<Env>) => Promise<Response>;

import type { CalendarEvent } from '../events.interface';
import { initialEventsData } from '../seed-data';

// --- CLOUDFLARE WORKER LOGIC ---

// Defines the binding to the KV namespace. 
// The types (`KVNamespace`, `PagesFunction`, `EventContext`) are provided by the Cloudflare environment.
interface Env {
  EVENTS_KV: KVNamespace;
}

// Define standard CORS headers for all responses.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const DATA_KEY = 'events_data';

// Helper function to seed initial data into the KV store if it's empty.
const ensureDataSeeded = async (kv: KVNamespace) => {    
    const data = await kv.get(DATA_KEY);
    if (!data) {
        // Assign IDs to seed data before storing
        const eventsWithIds = initialEventsData.map((event, index) => ({
            ...event,
            id: event.id || (index + 1).toString(),
        }));
        await kv.put(DATA_KEY, JSON.stringify(eventsWithIds));
    }
};

// This is the main request handler for all requests to /events/*
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;

  // Handle CORS preflight requests for browser compatibility.
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  
  // CRITICAL: Check if the KV binding is configured in Cloudflare Pages.
  if (!env.EVENTS_KV) {
    const errorMessage = "اتصال به پایگاه داده (KV binding 'EVENTS_KV') برقرار نیست. لطفاً تنظیمات پروژه خود را در داشبورد Cloudflare Pages بررسی کنید.";
    console.error(errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  // Ensure initial event data exists in the KV store.
  await ensureDataSeeded(env.EVENTS_KV);

  // Retrieve the entire list of events.
  const events: CalendarEvent[] = await env.EVENTS_KV.get(DATA_KEY, { type: 'json' }) || [];
  
  // Extract the event ID from the URL path (e.g., /events/123 -> id is '123').
  const id = params.path && params.path.length > 0 ? params.path[0] : null;

  switch (request.method) {
    case 'GET':
      // Return a single event if an ID is provided, otherwise return all events.
      if (id) {
        const event = events.find(e => e.id === id);
        if (event) {
          return new Response(JSON.stringify(event), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ message: 'Event not found' }), { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
      } else {
        return new Response(JSON.stringify(events), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
      }

    case 'POST':
      try {
        const newEventData = await request.json() as Omit<CalendarEvent, 'id'>;
        const newEvent: CalendarEvent = {
          id: crypto.randomUUID(), // Generate a secure, unique ID.
          ...newEventData,
        };
        const updatedEvents = [...events, newEvent];
        await env.EVENTS_KV.put(DATA_KEY, JSON.stringify(updatedEvents));
        return new Response(JSON.stringify(newEvent), { status: 201, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ message: 'Invalid JSON body' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
      }

    case 'PATCH':
      if (!id) {
        return new Response(JSON.stringify({ message: 'Event ID required' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
      }
      try {
        const updateData = await request.json() as Partial<CalendarEvent>;
        let eventUpdated = false;
        const updatedEvents = events.map(event => {
          if (event.id === id) {
            eventUpdated = true;
            return { ...event, ...updateData };
          }
          return event;
        });

        if (eventUpdated) {
          await env.EVENTS_KV.put(DATA_KEY, JSON.stringify(updatedEvents));
          const updatedEvent = updatedEvents.find(e => e.id === id);
          return new Response(JSON.stringify(updatedEvent), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ message: 'Event not found' }), { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ message: 'Invalid JSON body' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
      }

    case 'DELETE':
       if (!id) {
        return new Response(JSON.stringify({ message: 'Event ID required' }), { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
      }
      const initialLength = events.length;
      const filteredEvents = events.filter(e => e.id !== id);

      if (filteredEvents.length < initialLength) {
        await env.EVENTS_KV.put(DATA_KEY, JSON.stringify(filteredEvents));
        return new Response(JSON.stringify({ message: `Event with ID ${id} deleted successfully.` }), { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({ message: 'Event not found' }), { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    default:
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  }
};