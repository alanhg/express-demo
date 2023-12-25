import speclist, {
  diffVersionedCompletions as versionedSpeclist,
} from "/js/@withfig/autocomplete/build/index.js";

const specSet = {};
(speclist).forEach((s) => {
  let activeSet = specSet;
  const specRoutes = s.split("/");
  specRoutes.forEach((route, idx) => {
    if (idx === specRoutes.length - 1) {
      const prefix = versionedSpeclist.includes(s) ? "/index.js" : `.js`;
      activeSet[route] = `/js/@withfig/autocomplete/build/${s}${prefix}`;
    } else {
      activeSet[route] = activeSet[route] || {};
      activeSet = activeSet[route];
    }
  });
});

console.log('specSet',specSet);
