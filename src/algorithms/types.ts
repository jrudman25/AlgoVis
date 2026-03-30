/**
 * Shared types for sorting algorithm step tracking.
 */

/** A single step in a sorting algorithm animation. */
export interface SortStep {
  /** The type of operation: comparing two elements or performing a swap/placement. */
  type: 'compare' | 'swap';
  /** The array indices involved in this step. */
  indices: number[];
  /** The full array state after a swap (only present for 'swap' steps). */
  newArray?: number[];
}
