export const generateText = async () => {
	const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": `Bearer ${process.env.REACT_APP_IBM_ACCESS_TOKEN}` // Correct template literal usage
	};
	const body = {
		input: "You are a hurricane expert, providing guidance to those about to experience a hurricane.\nYou are given a list of places, and some context. You need to output ONLY two lists titled Recommended and Items. the Recommended list subsets the list of places you were originally given, and it tells the user what Places you recommend going to to stock up on supplies, keeping in mind the context provided, if provided. The Items list gives the user a list of items that will help them prepare for the storm that the stores in your original list sell. \n\nDraw from this list of Places to recommend: \nPublix, Walmart, Target, Costco, Sam'\''s Club, Aldi, Kroger, Safeway, Winn-Dixie, Whole Foods, Trader Joe'\''s, BJ'\''s Wholesale Club, The Home Depot, Lowe'\''s, Ace Hardware, True Value, Dollar General, Family Dollar, CVS, Walgreens, Rite Aid, Food Lion, Save-A-Lot, Meijer, Giant, H-E-B, Stop & Shop, Piggly Wiggly, ShopRite, Fred Meyer, Albertsons, Vons, Harris Teeter, Hy-Vee, Price Chopper, Ingles Markets.\n\nDO NOT recommend Places not on this list, unless you are sure that they provide good, related services\n\nDraw from this list of supplies to recommend:\nWater, non-perishable food, manual can opener, prescription medications, over-the-counter medications, medical supplies, adhesive bandages, sterile gauze, antiseptic wipes, pain relievers, tweezers, scissors, adhesive tape, burn ointment, antiseptic cream, thermometer, hand sanitizer, soap, toilet paper, wet wipes, tissues, feminine hygiene products, garbage bags, bleach, disinfectant, flashlights, extra batteries, portable radio, multi-tool, Swiss Army knife, duct tape, plastic sheeting, tarps, fire extinguisher, blankets, sleeping bags, pillows, tent, copies of identification, insurance papers, medical records, emergency contact list, portable phone chargers, battery packs, generator, fuel, life jackets, whistle, work gloves, sturdy shoes, boots, rain gear, ponchos, raincoats, waterproof boots, warm clothing, cash, pet food, pet water, leash, harness, pet carrier, pet medications, pet waste bags, full tank of gas, emergency car kit, jumper cables, spare tire, tire repair kit, flares, map, secure outdoor items, window protection, plywood, hurricane shutters, sandbags, emergency kit for power outage, candles, matches, lighters, glow sticks, books, puzzles, board games, charged tablets, e-readers, evacuation plan, transportation for mobility-impaired individuals, diapers, baby wipes, baby food, baby formula, toys, comfort items, local shelter locations, important contact numbers, family, friends, emergency services, insurance, medical.\n\nInput: Cane'\''s, Walmart, Home Depot, Rowdy\n\nWhat places should I go to get supplies?\nOutput: Recommended Places: Home Depot, Walmart\nItems: Water, Bread, First-Aid Kit\n\nInput: Publix, Walmart, The Reitz Union , Grog\nOutput: Recommended Places: Publix, Walmart\nItems: Bread, Canned Food, Water\n\nInput: I have these locations near me: \nCane'\''s, Publix, Home Depot, Rowdy\n\nWhat places should I go to get supplies?\nOutput: Recommended Places: Home Depot, Rowdy \nItems: Water, Bread, First-Aid Kit\n\nInput: Publix, Reitz Union, El Indio, Chick-fil-A\nOutput: Recommended: Publix\n Items: Non-Perishable Food, Bread, Canned Food, Water\n\nInput: BJ'\''s Wholesale Club, CVS, The Swamp Shop, Downtown Depot\nOutput: Recommended: BJ'\''s Wholesale Club, CVS\nItems: Non-Perishable Food, Bread, Canned Food, Water\n\nInput: BJ'\''s Wholesale Club, CVS, The Swamp Shop, Downtown Depot\n\nI have kids \nOutput: Recommended: BJ'\''s Wholesale Club, CVS\nItems: Non-Perishable Food, Bread, Canned Food, Water, Baby Food, Diapers\n\nInput: Publix, Grog, Social, JJ'\''s Bar and Grill\n\nOutput: Recommended: Publix\nItems: Water, Non-Perishable Food, Manual Can Opener, Prescription Medications, Over-the-Counter Medications, Medical Supplies, Adhesive Bandages, Sterile Gauze, Antiseptic Wipes, Pain Relievers, Tweezers, Scissors, Adhesive Tape, Burn Ointment, Antiseptic Cream, Thermometer, Hand Sanitizer, Soap, Toilet Paper, Wet Wipes, Tissues, Feminine Hygiene Products, Garbage Bags, Bleach, Disinfectant, Flashlights, Extra Batteries, Portable Radio, Multi-Tool, Swiss Army knife, Duct Tape, Plastic Sheeting, Tarps, Fire Extinguisher, Blankets, Sleep\n\nInput: Publix, Grog, Social, JJ'\''s Bar and Grill\nOutput:",
		parameters: {
			decoding_method: "greedy",
			max_new_tokens: 200,
			min_new_tokens: 0,
			stop_sequences: [],
			repetition_penalty: 1
		},
		model_id: "google/flan-ul2",
		project_id: "55363775-1ea6-4ef3-8235-a55a697c29df",
		moderations: {
			hap: {
				input: {
					enabled: true,
					threshold: 0.5,
					mask: {
						remove_entity_value: true
					}
				},
				output: {
					enabled: true,
					threshold: 0.5,
					mask: {
						remove_entity_value: true
					}
				}
			},
			pii: {
				input: {
					enabled: true,
					threshold: 0.5,
					mask: {
						remove_entity_value: true
					}
				},
				output: {
					enabled: true,
					threshold: 0.5,
					mask: {
						remove_entity_value: true
					}
				}
			}
		}
	};

	const response = await fetch(url, {
		headers,
		method: "POST",
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		throw new Error("Non-200 response");
	}

	return await response.json();
}
  