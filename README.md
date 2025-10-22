<div align="center">

![GitHub top language](https://img.shields.io/github/languages/top/crenata/bejibun-database)
![GitHub all releases](https://img.shields.io/github/downloads/crenata/bejibun-database/total)
![GitHub issues](https://img.shields.io/github/issues/crenata/bejibun-database)
![GitHub](https://img.shields.io/github/license/crenata/bejibun-database)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/crenata/bejibun-database?display_name=tag&include_prereleases)

</div>

# Database for Bejibun
Database package with Built-in Bun for Bejibun Framework.

## Usage

### Installation
Install the package.

```bash
# Using Bun
bun add @bejibun/database

# Using Bejibun
bun ace install @bejibun/database
```

### Configuration
Add `database.ts` inside config directory on your project

```bash
config/database.ts
```

```ts
const config: Record<string, any> = {
    default: "local",

    connections: {
        local: {
            host: "127.0.0.1",
            port: 6379,
            password: "",
            database: 0,
            maxRetries: 10
        }
    }
};

export default config;
```

You can pass the value with environment variables.

### How to Use
How to use tha package.

```ts
import type {DatabasePipeline} from "@bejibun/database/types";
import BaseController from "@bejibun/core/bases/BaseController";
import Logger from "@bejibun/logger";
import Database from "@bejibun/database";

export default class TestController extends BaseController {
    public async database(request: Bun.BunRequest): Promise<Response> {
        await Database.set("database", {hello: "world"});
        const database = await Database.get("database");

        await Database.connection("local").set("connection", "This is using custom connection.");
        const connection = await Database.connection("local").get("connection");

        const pipeline = await Database.pipeline((pipe: DatabasePipeline) => {
            pipe.set("database-pipeline-1", "This is database pipeline 1");
            pipe.set("database-pipeline-2", "This is database pipeline 2");

            pipe.get("database-pipeline-1");
            pipe.get("database-pipeline-2");
        });

        const subscriber = await Database.subscribe("database-subscribe", (message: string, channel: string) => {
            Logger.setContext(channel).debug(message);
        });
        await Database.publish("database-subscribe", "Hai database subscriber!");
        setTimeout(async () => {
            await subscriber.unsubscribe();
        }, 500);

        return super.response.setData({database, connection, pipeline}).send();
    }
}
```

## Contributors
- [Havea Crenata](mailto:havea.crenata@gmail.com)

## ☕ Support / Donate

If you find this project helpful and want to support it, you can donate via PayPal :

[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?logo=paypal)](https://paypal.me/hafiizhghulam)

Or if you are prefer using crypto :

| EVM | Solana |
| --- | ------ |
| <img src="https://github.com/crenata/bejibun/blob/master/public/images/EVM.png?raw=true" width="150" /> | <img src="https://github.com/crenata/bejibun/blob/master/public/images/SOL.png?raw=true" width="150" /> |
| 0xdABe8750061410D35cE52EB2a418c8cB004788B3 | GAnoyvy9p3QFyxikWDh9hA3fmSk2uiPLNWyQ579cckMn |