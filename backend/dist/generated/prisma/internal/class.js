"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.8.0",
    "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
    "activeProvider": "sqlite",
    "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider     = \"prisma-client\"\n  output       = \"../generated/prisma\"\n  moduleFormat = \"cjs\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n}\n\nmodel User {\n  id           String  @id @default(uuid()) // UUID pour ne pas exposer des IDs séquentiels (sécurité)\n  email        String  @unique\n  passwordHash String // Stockera le mot de passe haché par Argon2\n  firstName    String?\n  lastName     String?\n\n  hashedRefreshToken String?\n\n  // Gestion du statut du compte (OWASP Best Practices)\n  isEmailVerified            Boolean   @default(false)\n  isActive                   Boolean   @default(true)\n  emailVerificationHash      String? // Le token de vérification haché (SHA-256)\n  emailVerificationExpiresAt DateTime? // Date d'expiration du token (ex: 24h)\n\n  // Sécurité avancée (2FA)\n  twoFactorSecret    String?\n  isTwoFactorEnabled Boolean @default(false)\n\n  // Dates d'audit\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"firstName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"hashedRefreshToken\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isEmailVerified\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"emailVerificationHash\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"emailVerificationExpiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"twoFactorSecret\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isTwoFactorEnabled\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"orderBy\",\"cursor\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"data\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"create\",\"update\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"having\",\"_count\",\"_min\",\"_max\",\"User.groupBy\",\"User.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"email\",\"passwordHash\",\"firstName\",\"lastName\",\"hashedRefreshToken\",\"isEmailVerified\",\"isActive\",\"emailVerificationHash\",\"emailVerificationExpiresAt\",\"twoFactorSecret\",\"isTwoFactorEnabled\",\"createdAt\",\"updatedAt\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"set\"]"),
    graph: "OgkQERoAACwAMBsAAAQAEBwAACwAMB0BAAAAAR4BAAAAAR8BAC0AISABAC4AISEBAC4AISIBAC4AISMgAC8AISQgAC8AISUBAC4AISZAADAAIScBAC4AISggAC8AISlAADEAISpAADEAIQEAAAABACABAAAAAQAgERoAACwAMBsAAAQAEBwAACwAMB0BAC0AIR4BAC0AIR8BAC0AISABAC4AISEBAC4AISIBAC4AISMgAC8AISQgAC8AISUBAC4AISZAADAAIScBAC4AISggAC8AISlAADEAISpAADEAIQYgAAAyACAhAAAyACAiAAAyACAlAAAyACAmAAAyACAnAAAyACADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACAOHQEAAAABHgEAAAABHwEAAAABIAEAAAABIQEAAAABIgEAAAABIyAAAAABJCAAAAABJQEAAAABJkAAAAABJwEAAAABKCAAAAABKUAAAAABKkAAAAABAQgAAAkAIA4dAQAAAAEeAQAAAAEfAQAAAAEgAQAAAAEhAQAAAAEiAQAAAAEjIAAAAAEkIAAAAAElAQAAAAEmQAAAAAEnAQAAAAEoIAAAAAEpQAAAAAEqQAAAAAEBCAAACwAwAQgAAAsAMA4dAQA2ACEeAQA2ACEfAQA2ACEgAQA3ACEhAQA3ACEiAQA3ACEjIAA4ACEkIAA4ACElAQA3ACEmQAA5ACEnAQA3ACEoIAA4ACEpQAA6ACEqQAA6ACECAAAAAQAgCAAADgAgDh0BADYAIR4BADYAIR8BADYAISABADcAISEBADcAISIBADcAISMgADgAISQgADgAISUBADcAISZAADkAIScBADcAISggADgAISlAADoAISpAADoAIQIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgCRUAADMAIBYAADUAIBcAADQAICAAADIAICEAADIAICIAADIAICUAADIAICYAADIAICcAADIAIBEaAAAaADAbAAAXABAcAAAaADAdAQAbACEeAQAbACEfAQAbACEgAQAcACEhAQAcACEiAQAcACEjIAAdACEkIAAdACElAQAcACEmQAAeACEnAQAcACEoIAAdACEpQAAfACEqQAAfACEDAAAABAAgAwAAFgAwFAAAFwAgAwAAAAQAIAMAAAUAMAQAAAEAIBEaAAAaADAbAAAXABAcAAAaADAdAQAbACEeAQAbACEfAQAbACEgAQAcACEhAQAcACEiAQAcACEjIAAdACEkIAAdACElAQAcACEmQAAeACEnAQAcACEoIAAdACEpQAAfACEqQAAfACEOFQAAIQAgFgAAKwAgFwAAKwAgKwEAAAABLAEAAAAELQEAAAAELgEAAAABLwEAAAABMAEAAAABMQEAAAABMgEAKgAhMwEAAAABNAEAAAABNQEAAAABDhUAACQAIBYAACkAIBcAACkAICsBAAAAASwBAAAABS0BAAAABS4BAAAAAS8BAAAAATABAAAAATEBAAAAATIBACgAITMBAAAAATQBAAAAATUBAAAAAQUVAAAhACAWAAAnACAXAAAnACArIAAAAAEyIAAmACELFQAAJAAgFgAAJQAgFwAAJQAgK0AAAAABLEAAAAAFLUAAAAAFLkAAAAABL0AAAAABMEAAAAABMUAAAAABMkAAIwAhCxUAACEAIBYAACIAIBcAACIAICtAAAAAASxAAAAABC1AAAAABC5AAAAAAS9AAAAAATBAAAAAATFAAAAAATJAACAAIQsVAAAhACAWAAAiACAXAAAiACArQAAAAAEsQAAAAAQtQAAAAAQuQAAAAAEvQAAAAAEwQAAAAAExQAAAAAEyQAAgACEIKwIAAAABLAIAAAAELQIAAAAELgIAAAABLwIAAAABMAIAAAABMQIAAAABMgIAIQAhCCtAAAAAASxAAAAABC1AAAAABC5AAAAAAS9AAAAAATBAAAAAATFAAAAAATJAACIAIQsVAAAkACAWAAAlACAXAAAlACArQAAAAAEsQAAAAAUtQAAAAAUuQAAAAAEvQAAAAAEwQAAAAAExQAAAAAEyQAAjACEIKwIAAAABLAIAAAAFLQIAAAAFLgIAAAABLwIAAAABMAIAAAABMQIAAAABMgIAJAAhCCtAAAAAASxAAAAABS1AAAAABS5AAAAAAS9AAAAAATBAAAAAATFAAAAAATJAACUAIQUVAAAhACAWAAAnACAXAAAnACArIAAAAAEyIAAmACECKyAAAAABMiAAJwAhDhUAACQAIBYAACkAIBcAACkAICsBAAAAASwBAAAABS0BAAAABS4BAAAAAS8BAAAAATABAAAAATEBAAAAATIBACgAITMBAAAAATQBAAAAATUBAAAAAQsrAQAAAAEsAQAAAAUtAQAAAAUuAQAAAAEvAQAAAAEwAQAAAAExAQAAAAEyAQApACEzAQAAAAE0AQAAAAE1AQAAAAEOFQAAIQAgFgAAKwAgFwAAKwAgKwEAAAABLAEAAAAELQEAAAAELgEAAAABLwEAAAABMAEAAAABMQEAAAABMgEAKgAhMwEAAAABNAEAAAABNQEAAAABCysBAAAAASwBAAAABC0BAAAABC4BAAAAAS8BAAAAATABAAAAATEBAAAAATIBACsAITMBAAAAATQBAAAAATUBAAAAAREaAAAsADAbAAAEABAcAAAsADAdAQAtACEeAQAtACEfAQAtACEgAQAuACEhAQAuACEiAQAuACEjIAAvACEkIAAvACElAQAuACEmQAAwACEnAQAuACEoIAAvACEpQAAxACEqQAAxACELKwEAAAABLAEAAAAELQEAAAAELgEAAAABLwEAAAABMAEAAAABMQEAAAABMgEAKwAhMwEAAAABNAEAAAABNQEAAAABCysBAAAAASwBAAAABS0BAAAABS4BAAAAAS8BAAAAATABAAAAATEBAAAAATIBACkAITMBAAAAATQBAAAAATUBAAAAAQIrIAAAAAEyIAAnACEIK0AAAAABLEAAAAAFLUAAAAAFLkAAAAABL0AAAAABMEAAAAABMUAAAAABMkAAJQAhCCtAAAAAASxAAAAABC1AAAAABC5AAAAAAS9AAAAAATBAAAAAATFAAAAAATJAACIAIQAAAAABNgEAAAABATYBAAAAAQE2IAAAAAEBNkAAAAABATZAAAAAAQAAAAADFQAGFgAHFwAIAAAAAxUABhYABxcACAECAQIDAQUGAQYHAQcIAQkKAQoMAgsNAwwPAQ0RAg4SBBETARIUARMVAhgYBRkZCQ"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.sqlite.js"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.sqlite.wasm-base64.js");
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map