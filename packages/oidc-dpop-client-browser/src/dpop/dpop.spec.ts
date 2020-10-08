/*
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { describe, it } from "@jest/globals";

import {
  decodeJWT,
  generateJWK,
  generateKeyForDpop,
  generateRsaKey,
  signJWT,
} from "./dpop";

describe("generateJWK", () => {
  it("can generate a RSA-based JWK", async () => {
    const key = await generateJWK("RSA");
    expect(key.kty).toEqual("RSA");
  });

  it("can generate an elliptic curve-based JWK", async () => {
    const key = await generateJWK("EC", "P-256");
    expect(key.kty).toEqual("EC");
  });
});

describe("generateKeyForDpop", () => {
  it("generates an elliptic curve-base key, which is a sensible default for DPoP", async () => {
    const key = await generateKeyForDpop();
    expect(key.kty).toEqual("EC");
  });
});

describe("generateRsaKey", () => {
  it("generates an RSA key", async () => {
    const key = await generateRsaKey();
    expect(key.kty).toEqual("RSA");
  });
});

describe("signJWT/decodeJWT", () => {
  it("generates a JWT that can be decoded without signature verification", async () => {
    const key = await generateKeyForDpop();
    const payload = { testClaim: "testValue" };
    const jwt = await signJWT(payload, key, {
      algorithm: "RS256",
    });
    const decoded = await decodeJWT(jwt);
    expect(decoded.testClaim).toEqual(payload.testClaim);
  });

  it("can verify the ES256 signature of the generated JWT", async () => {
    const key = await generateKeyForDpop();
    const payload = { testClaim: "testValue" };
    const jwt = await signJWT(payload, key, {
      algorithm: "ES256",
    });
    const decoded = await decodeJWT(jwt, key, { algorithms: ["ES256"] });
    expect(decoded.testClaim).toEqual(payload.testClaim);
  });
});
