import OpenAI from "openai";
import fs from "fs/promises";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
  organization: "org-kxYVbuAgDrY7rFzEjNH3Xarx",
});

async function request(content) {
  let term = "codon";
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a dictionary that provides concise definitions for techincal terms you are asked. Also, you include useful examples when relevant.",
      },
      {
        role: "user",
        content,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return chatCompletion;
}

async function checkDb() {
  try {
    if (await fs.access("db.json", fs.constants.F_OK)) {
      //
    }
  } catch (e) {
    await fs.writeFile("db.json", "[]", "utf-8");
  }
}

/** @param {string} term */
async function main(term) {
  await checkDb();
  /** @type {Array<OpenAI.Chat.Completions.ChatCompletion> } */
  const json = JSON.parse(await fs.readFile("db.json", "utf-8"));
  const content = `What is a definition for "${term}"?`;
  const res = await request(content);
  res.meta = {
    content,
    term,
  };
  console.log(res.choices[0].message.content);
  console.log("\nSaving to `db.json`...");
  json.push(res);
  await fs.writeFile("db.json", JSON.stringify(json, null, 2), "utf-8");
}

const term = process.argv.slice(2);

if (term.length !== 1) {
  throw Error(`Malformed input. Usage: npm run start "term goes here".`);
}

main(term);
