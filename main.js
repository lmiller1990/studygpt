import OpenAI from "openai";
import fs from "fs/promises";
import minimist from "minimist";

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
    // model: "gpt-4",
    model: "gpt-3.5-turbo",
  });

  return chatCompletion;
}

async function createImage() {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt:
      "Diagram of the stages of mitosis. Only include basic labels, minimal words, and ensure words are spelled correctly.",
    n: 1,
    // size: "1024x1024",
  });
  console.log(response.data[0].url);
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
/** @param {string | null} topic */
async function main(term, topic = null) {
  await checkDb();

  /** @type {Array<OpenAI.Chat.Completions.ChatCompletion & { meta: { term: string }}> } */
  const json = JSON.parse(await fs.readFile("db.json", "utf-8"));

  const cached = json.find((def) => def.meta.term === term);
  if (cached) {
    console.log(cached.choices[0].message.content);
    return;
  }

  const content = `What is a definition for "${term}"?`;
  const res = await request(content);

  res.meta = {
    content,
    term,
    topic,
  };

  console.log(res.choices[0].message.content);
  console.log("\nSaving to `db.json`...");

  json.push(res);
  await fs.writeFile("db.json", JSON.stringify(json, null, 2), "utf-8");
}

const argv = minimist(process.argv.slice(2));
console.log(argv);
// const term = process.argv.slice(2);

if (argv._.length !== 1) {
  throw Error(`Malformed input. Usage: npm run start "term goes here".`);
}

const term = argv._[0];

main(term.toLowerCase(), argv.topic);
