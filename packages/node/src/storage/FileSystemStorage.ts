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

/**
 * @hidden
 * @packageDocumentation
 */

import { IStorage, NotImplementedError } from "@inrupt/solid-client-authn-core";
import { readFile } from "fs/promises";
import { existsSync, writeFileSync } from "fs";

export const get = async (
  path: string,
  key: string
): Promise<string | undefined> => {
  try {
    const rawData = await readFile(path, {
      encoding: "utf-8",
    });
    const parsedData = JSON.parse(rawData);
    return parsedData[key] || undefined;
  } catch (e) {
    throw new Error(
      `An error happened while parsing JSON content of ${path}: ${e}`
    );
  }
};

/**
 * Simple persistent storage solution that uses a file on the host filesystem to store data
 * @hidden
 */
export default class FileSystemStorage implements IStorage {
  private map: Record<string, string> = {};

  constructor(private path: string) {
    // If the file does not exist, create it
    if (!existsSync(path)) {
      writeFileSync(path, "");
    }
  }

  get = (key: string): Promise<string | undefined> => get(this.path, key);

  async set(key: string, value: string): Promise<void> {
    throw new NotImplementedError("FileSystemStorage.set not implemented yet");
  }

  async delete(key: string): Promise<void> {
    throw new NotImplementedError(
      "FileSystemStorage.delete not implemented yet"
    );
  }
}
