import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Sem ISR, sem next/image e sem rotas Edge neste projeto:
// nao precisamos de R2, D1 nem Durable Objects. O adapter padrao basta.
export default defineCloudflareConfig();
