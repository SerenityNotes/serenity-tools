import sodium from "libsodium-wrappers";
import { createChain } from "./index";
import { getKeyPairsA, KeyPairs } from "./testUtils";
import { isValidCreateChainEvent } from "./utils";

let keyPairsA: KeyPairs = null;

beforeAll(async () => {
  await sodium.ready;
  keyPairsA = getKeyPairsA();
});

test("should create a new chain event", async () => {
  const event = createChain(keyPairsA.sign, {
    [keyPairsA.sign.publicKey]: keyPairsA.box.publicKey,
  });
  expect(event.prevHash).toBeNull();
  expect(isValidCreateChainEvent(event)).toBe(true);
});
