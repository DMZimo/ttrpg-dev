Hooks.once('diceSoNiceReady', (dice3d) => {
	dice3d.addSystem({id: "trs-foundryvtt-dice-set", name: "The Rollsmith - Foundry VTT"}, false);
	dice3d.addDicePreset({
		type: "d2",
		labels: "",
		modelFile: "modules/trs-foundryvtt-dice-set/models/dice_2.gltf",
		system: "trs-foundryvtt-dice-set"
	});
	dice3d.addDicePreset({
		type: "d4",
		labels: "",
		modelFile: "modules/trs-foundryvtt-dice-set/models/dice_4.gltf",
		system: "trs-foundryvtt-dice-set"
	});
	dice3d.addDicePreset({
		type: "d6",
		labels: "",
		modelFile: "modules/trs-foundryvtt-dice-set/models/dice_6.gltf",
		system: "trs-foundryvtt-dice-set"
	});
	dice3d.addDicePreset({
		type: "d8",
		labels: "",
		modelFile: "modules/trs-foundryvtt-dice-set/models/dice_8.gltf",
		system: "trs-foundryvtt-dice-set"
	});
	dice3d.addDicePreset({
		type: "d10",
		labels: "",
		modelFile: "modules/trs-foundryvtt-dice-set/models/dice_10.gltf",
		system: "trs-foundryvtt-dice-set"
	});
	dice3d.addDicePreset({
		type: "d100",
		labels: "",
		modelFile: "modules/trs-foundryvtt-dice-set/models/dice_100.gltf",
		system: "trs-foundryvtt-dice-set"
	});
	dice3d.addDicePreset({
		type: "d12",
		labels: "",
		modelFile: "modules/trs-foundryvtt-dice-set/models/dice_12.gltf",
		system: "trs-foundryvtt-dice-set"
	});	
	dice3d.addDicePreset({
		type: "d20",
		labels: "",
		modelFile: "modules/trs-foundryvtt-dice-set/models/dice_20.gltf",
		system: "trs-foundryvtt-dice-set"
	});
});
