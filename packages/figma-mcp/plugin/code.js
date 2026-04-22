figma.showUI(__html__, { visible: true, width: 300, height: 200, title: "Metapowers Bridge" });

figma.ui.onmessage = async (msg) => {
	const { requestId, method, params } = msg;

	try {
		let result;

		switch (method) {
			case "CREATE_FRAME": {
				const frame = figma.createFrame();
				frame.name = params.name || "Frame";
				frame.resize(params.width || 100, params.height || 100);
				if (params.x !== undefined) frame.x = params.x;
				if (params.y !== undefined) frame.y = params.y;
				if (params.fills) frame.fills = params.fills;
				figma.currentPage.appendChild(frame);
				result = { id: frame.id, name: frame.name };
				break;
			}
			case "CREATE_COMPONENT": {
				const comp = figma.createComponent();
				comp.name = params.name || "Component";
				comp.resize(params.width || 100, params.height || 100);
				if (params.x !== undefined) comp.x = params.x;
				if (params.y !== undefined) comp.y = params.y;
				if (params.fills) comp.fills = params.fills;
				figma.currentPage.appendChild(comp);
				result = { id: comp.id, name: comp.name };
				break;
			}
			case "CREATE_INSTANCE": {
				const component = await figma.getNodeByIdAsync(params.componentId);
				if (!component || component.type !== "COMPONENT") throw new Error("Component not found: " + params.componentId);
				const instance = component.createInstance();
				if (params.x !== undefined) instance.x = params.x;
				if (params.y !== undefined) instance.y = params.y;
				result = { id: instance.id, name: instance.name };
				break;
			}
			case "CREATE_TEXT": {
				const text = figma.createText();
				await figma.loadFontAsync({ family: params.fontFamily || "Inter", style: params.fontStyle || "Regular" });
				text.characters = params.text || "";
				text.fontSize = params.fontSize || 16;
				text.name = params.name || "Text";
				if (params.x !== undefined) text.x = params.x;
				if (params.y !== undefined) text.y = params.y;
				if (params.fills) text.fills = params.fills;
				figma.currentPage.appendChild(text);
				result = { id: text.id, name: text.name };
				break;
			}
			case "CREATE_SHAPE": {
				let shape;
				switch (params.type || "RECTANGLE") {
					case "RECTANGLE": shape = figma.createRectangle(); break;
					case "ELLIPSE": shape = figma.createEllipse(); break;
					case "POLYGON": shape = figma.createPolygon(); break;
					case "STAR": shape = figma.createStar(); break;
					case "LINE": shape = figma.createLine(); break;
					default: throw new Error("Unknown shape type: " + params.type);
				}
				shape.name = params.name || params.type || "Shape";
				if (params.width && params.height) shape.resize(params.width, params.height);
				if (params.x !== undefined) shape.x = params.x;
				if (params.y !== undefined) shape.y = params.y;
				if (params.fills) shape.fills = params.fills;
				if (params.cornerRadius !== undefined && "cornerRadius" in shape) shape.cornerRadius = params.cornerRadius;
				figma.currentPage.appendChild(shape);
				result = { id: shape.id, name: shape.name, type: shape.type };
				break;
			}
			case "MODIFY_NODE": {
				const node = await figma.getNodeByIdAsync(params.nodeId);
				if (!node) throw new Error("Node not found: " + params.nodeId);
				const props = params.properties || {};
				if (props.width !== undefined || props.height !== undefined) {
					node.resize(props.width !== undefined ? props.width : node.width, props.height !== undefined ? props.height : node.height);
				}
				for (const [key, value] of Object.entries(props)) {
					if (key === "width" || key === "height") continue;
					if (key in node) node[key] = value;
				}
				result = { id: node.id, name: node.name };
				break;
			}
			case "DELETE_NODE": {
				const nodeToDelete = await figma.getNodeByIdAsync(params.nodeId);
				if (!nodeToDelete) throw new Error("Node not found: " + params.nodeId);
				nodeToDelete.remove();
				result = { deleted: params.nodeId };
				break;
			}
			case "ARRANGE_COMPONENT_SET": {
				const componentNodes = [];
				for (const id of params.componentIds) {
					const n = await figma.getNodeByIdAsync(id);
					if (n && n.type === "COMPONENT") componentNodes.push(n);
				}
				if (componentNodes.length < 2) throw new Error("Need at least 2 components to combine as variants");
				const parent = componentNodes[0].parent || figma.currentPage;
				const componentSet = figma.combineAsVariants(componentNodes, parent);
				componentSet.name = params.name || componentSet.name;
				result = { id: componentSet.id, name: componentSet.name };
				break;
			}
			case "GROUP_NODES": {
				const nodesToGroup = [];
				for (const id of params.nodeIds) {
					const n = await figma.getNodeByIdAsync(id);
					if (n) nodesToGroup.push(n);
				}
				if (nodesToGroup.length === 0) throw new Error("No valid nodes to group");
				const groupParent = nodesToGroup[0].parent || figma.currentPage;
				const group = figma.group(nodesToGroup, groupParent);
				group.name = params.name || "Group";
				result = { id: group.id, name: group.name };
				break;
			}
			case "SET_AUTO_LAYOUT": {
				const alNode = await figma.getNodeByIdAsync(params.nodeId);
				if (!alNode || !("layoutMode" in alNode)) throw new Error("Node does not support auto-layout");
				alNode.layoutMode = params.direction || "VERTICAL";
				if (params.spacing !== undefined) alNode.itemSpacing = params.spacing;
				if (params.paddingHorizontal !== undefined) { alNode.paddingLeft = params.paddingHorizontal; alNode.paddingRight = params.paddingHorizontal; }
				if (params.paddingVertical !== undefined) { alNode.paddingTop = params.paddingVertical; alNode.paddingBottom = params.paddingVertical; }
				if (params.primaryAxisSizingMode) alNode.primaryAxisSizingMode = params.primaryAxisSizingMode;
				if (params.counterAxisSizingMode) alNode.counterAxisSizingMode = params.counterAxisSizingMode;
				result = { id: alNode.id, layoutMode: alNode.layoutMode };
				break;
			}
			case "APPLY_STYLES": {
				const styledNode = await figma.getNodeByIdAsync(params.nodeId);
				if (!styledNode) throw new Error("Node not found: " + params.nodeId);
				if (params.fills && "fills" in styledNode) styledNode.fills = params.fills;
				if (params.strokes && "strokes" in styledNode) styledNode.strokes = params.strokes;
				if (params.strokeWeight !== undefined && "strokeWeight" in styledNode) styledNode.strokeWeight = params.strokeWeight;
				if (params.effects && "effects" in styledNode) styledNode.effects = params.effects;
				if (params.opacity !== undefined && "opacity" in styledNode) styledNode.opacity = params.opacity;
				if (params.cornerRadius !== undefined && "cornerRadius" in styledNode) styledNode.cornerRadius = params.cornerRadius;
				result = { id: styledNode.id, name: styledNode.name };
				break;
			}
			case "GET_SELECTION": {
				result = figma.currentPage.selection.map((n) => ({ id: n.id, name: n.name, type: n.type }));
				break;
			}
			case "GET_CURRENT_PAGE": {
				result = { id: figma.currentPage.id, name: figma.currentPage.name, childCount: figma.currentPage.children.length };
				break;
			}
			case "EXECUTE_CODE": {
				// Evaluate dynamic Plugin API code
				const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
				const fn = new AsyncFunction("figma", params.code);
				result = await fn(figma);
				break;
			}
			default:
				throw new Error("Unknown method: " + method);
		}

		figma.ui.postMessage({ requestId, success: true, result: safeClone(result) });
	} catch (error) {
		figma.ui.postMessage({ requestId, success: false, error: error instanceof Error ? error.message : String(error) });
	}
};

function safeClone(obj) {
	if (obj === null || obj === undefined) return obj;
	if (typeof obj !== "object") return obj;
	if (Array.isArray(obj)) return obj.map(safeClone);
	const result = {};
	for (const key of Object.keys(obj)) {
		try {
			const val = obj[key];
			if (typeof val !== "symbol" && typeof val !== "function") result[key] = safeClone(val);
		} catch { /* skip */ }
	}
	return result;
}
