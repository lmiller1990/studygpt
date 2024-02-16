import { Hono } from "hono";
import { serve } from "@hono/node-server";

import db from "./db.json" with { type: "json" };
import { jsxRenderer } from "hono/jsx-renderer";

const app = new Hono();

app.get("/api/terms", (c) => {
  return c.json(db);
});

const Terms = (props) => {
  return html`
    <ul>
      <li>ok</li>
    </ul>
  `;
};

app.get("/app/terms", (c) => {
  return c.html(`
    <style>
      body { 
        max-width: 400px; 
        white-space: pre-line; 
      }
      li { list-style: none; }
      h3 { margin: 0; }
      p { margin: 8px 0; }
    </style>
    <ul>
      ${db.map(term => {
        return `
        <li>
          <h3>${term.meta.term}</h3>
          <p>${term.choices[0].message.content}</p>
         </li>`
      }).join('')}
    </ul>
  `)
});

serve({
  fetch: app.fetch,
  port: 3001,
});
