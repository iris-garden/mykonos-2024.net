/* TODO load the images in the background
  const prefix = ctx.request.url.slice(0, -7);
  const idx1 = parseInt(ctx.request.url.slice(-7, -4));
  let left = idx1 - 1;
  let right = idx1 + 1;
  while (right < (numImages / 2)) {
    Promise.all(
      [[left, getPath(left)], [right, getPath(right)]].map(
        async ([idx3, path]) => await addToCache(ctx, idx3, `${prefix}${path}`)
      )
    ).then(() => null);
  }
  */
window.addEventListener("load", async () => {
  const numImages = 603;
  const cache = Object.fromEntries(Array(numImages).fill(0).map((_, idx) => [idx, null]));
  let currIdx = 1;
  const loadImageBkgd = async () => {
    cache[currIdx] = URL.createObjectURL(await (await fetch(`/api/image/${currIdx.toString().padStart(3, "0")}.jpg`)).blob());
  }
  const [prev, curr, loading, next] = ["prev", "curr", "loading", "next"].map((id) => window.document.getElementById(id));
  const imageLoader = (dir) => async () => {
    currIdx = currIdx + dir;
    if (currIdx == 0) {
      currIdx = numImages - 1;
    } else if (currIdx == numImages) {
      // TODO change back to 0 once files are renumbered
      currIdx = 1;
    };
    if (cache[currIdx] === null) {
      curr.classList.add("hidden");
      loading.classList.remove("hidden");
      await loadImageBkgd();
      curr.onload = () => {
        loading.classList.add("hidden");
        curr.classList.remove("hidden");
      };
    };
    curr.src = cache[currIdx];
  }
  [[prev, -1], [next, 1]].forEach(([ele, dir]) => ele.addEventListener("click", imageLoader(dir)));
  await imageLoader(0)();
});
