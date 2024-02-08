# StudyGPT

A Node.js program that wraps the OpenAI API to quickly get definitions for technical terms. 

# Requirements

Node.js 20.6+ (which supports `.env` out of the box)

# Usage

## Install

```sh
npm install
```

## Add `.env`

```sh
OPENAI_API_KEY=XXXXXXXXXXXXXX
```

## Try it

```sh
npm run start "amino acid"
```

```sh
npm run start "amino acid"

An amino acid is a building block of proteins, consisting of a central carbon atom bonded to an amino group (-NH2), a carboxyl group (-COOH), a hydrogen atom, and a unique side chain. There are 20 standard amino acids found in proteins, each with a different side chain, that determine their properties and functions. For example, glycine is the simplest amino acid with a hydrogen side chain, while phenylalanine has a benzene ring as its side chain.

Saving to `db.json`...
```

# Roadmap

- Binary
- More customization for prompt / level of detail 
- UI
- SaaS
- ???
- Profit