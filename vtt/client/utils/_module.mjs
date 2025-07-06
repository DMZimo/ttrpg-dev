/** @module utils */
export * as types from "./_types.mjs";
export * from "@common/utils/_module.mjs";
export * from "./helpers.mjs";

import {performIntegerSort} from "./helpers.mjs";

/**
 * @deprecated since v13
 * @ignore
 */
export const SortingHelpers = {
  performIntegerSort
};
