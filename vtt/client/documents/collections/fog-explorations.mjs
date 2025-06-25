import WorldCollection from "../abstract/world-collection.mjs";

/**
 * The singleton collection of FogExploration documents which exist within the active World.
 * @extends {WorldCollection}
 * @category Collections
 *
 * @see {@link foundry.documents.FogExploration}: The FogExploration document
 */
export default class FogExplorations extends WorldCollection {
  static documentName = "FogExploration";

  /**
   * Activate Socket event listeners to handle for fog resets
   * @param {Socket} socket     The active web socket connection
   * @internal
   */
  static _activateSocketListeners(socket) {
    socket.on("resetFog", ({sceneId}) => {
      if ( sceneId === canvas.id ) {
        canvas.fog?._handleReset();
      }
    });
  }
}
