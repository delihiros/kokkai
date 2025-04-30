# Kokkai API Client

A TypeScript client for accessing the Japanese National Diet Library's API.

## Installation
```bash
yarn add kokkai
```

## Usage

```typescript
import { KokkaiClient } from 'kokkai';

const client = new KokkaiClient();
const meetings = await client.getMeetingList({ nameOfHouse: '衆議院' });
console.log(meetings);
```