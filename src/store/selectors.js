import { createSelector } from '@reduxjs/toolkit';

export const selectNodes = (state) => state.flow.nodes;
export const selectEdges = (state) => state.flow.edges;
export const selectStartNodeId = (state) => state.flow.startNodeId;
export const selectSelectedNodeId = (state) => state.flow.selectedNodeId;

export const selectShowJson = (state) => state.ui.showJson;
export const selectShowImport = (state) => state.ui.showImport;
export const selectToast = (state) => state.ui.toast;

export const selectSelectedNode = createSelector(
  [selectNodes, selectSelectedNodeId],
  (nodes, selectedId) => nodes.find((n) => n.id === selectedId) || null
);

export const selectOutgoingEdges = (nodeId) =>
  createSelector([selectEdges], (edges) =>
    edges.filter((e) => e.source === nodeId)
  );

export const selectErrors = createSelector(
  [selectNodes, selectEdges, selectStartNodeId],
  (nodes, edges, startNodeId) => {
    const errors = {};
    const ids = nodes.map((n) => n.id);
    const seen = new Set();

    nodes.forEach((node) => {
      const ne = [];

      if (!node.id.trim()) ne.push('Node ID is required');
      if (seen.has(node.id)) ne.push('Duplicate node ID');
      seen.add(node.id);

      if (!node.data.description || !node.data.description.trim())
        ne.push('Description is required');
      if (!node.data.prompt || !node.data.prompt.trim())
        ne.push('Name is required');

      // Validate outgoing edges for this node
      const outgoing = edges.filter((e) => e.source === node.id);
      outgoing.forEach((edge, i) => {
        const label = `Edge ${i + 1}`;
        if (!edge.target) ne.push(`${label}: target node is required`);
        else if (!ids.includes(edge.target))
          ne.push(`${label}: target "${edge.target}" does not exist`);
        if (!edge.data?.condition || !edge.data.condition.trim())
          ne.push(`${label}: condition is required`);
      });

      if (ne.length > 0) errors[node.id] = ne;
    });

    // start node check
    if (!startNodeId || !ids.includes(startNodeId)) {
      errors.__global = errors.__global || [];
      errors.__global.push('A valid start node must be selected');
    }

    // from start
    if (startNodeId && ids.includes(startNodeId)) {
      const reachable = new Set();
      const queue = [startNodeId];
      while (queue.length > 0) {
        const cur = queue.shift();
        if (reachable.has(cur)) continue;
        reachable.add(cur);
        edges
          .filter((e) => e.source === cur)
          .forEach((e) => {
            if (ids.includes(e.target)) queue.push(e.target);
          });
      }
      nodes.forEach((node) => {
        if (!reachable.has(node.id)) {
          errors[node.id] = errors[node.id] || [];
          errors[node.id].push('Node is disconnected from the start node');
        }
      });
    }

    return errors;
  }
);

export const selectHasErrors = createSelector(
  [selectErrors],
  (errors) => Object.keys(errors).length > 0
);

export const selectSchema = createSelector(
  [selectNodes, selectEdges, selectStartNodeId],
  (nodes, edges, startNodeId) => ({
    start_node_id: startNodeId,
    nodes: nodes.map((node) => {
      const outgoing = edges.filter((e) => e.source === node.id);
      return {
        id: node.id,
        description: node.data.description || '',
        prompt: node.data.prompt || '',
        edges: outgoing.map((e) => ({
          to_node_id: e.target,
          condition: e.data?.condition || '',
          ...(e.data?.parameters && Object.keys(e.data.parameters).length > 0
            ? { parameters: e.data.parameters }
            : {}),
        })),
      };
    }),
  })
);

export const selectJsonString = createSelector([selectSchema], (schema) =>
  JSON.stringify(schema, null, 2)
);
