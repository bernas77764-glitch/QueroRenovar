import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache yet: the app has no ISR or "use cache" data. When the
// estimate or the internal area needs it, add the R2 incremental cache
// (see https://opennext.js.org/cloudflare/caching) and the matching binding
// in wrangler.jsonc.
export default defineCloudflareConfig({});
