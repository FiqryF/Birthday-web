(function () {
  const bg = document.getElementById("birthdayBg");
  if (!bg) return;

  const colors = ["#ff74c7", "#C9E0EB", "#7392B5", "#8350C4", "#f6eddf"];
  const shapes = ["piece", "piece", "piece", "ribbon"];
  const laneCount = 14;
  let lastSpark = 0;
  let laneIndex = 0;

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function createConfettiPiece(options = {}) {
    const piece = document.createElement("span");
    const isRibbon = pick(shapes) === "ribbon";
    piece.className = `confetti-piece${isRibbon ? " ribbon" : ""}`;

    const laneWidth = 100 / laneCount;
    const lane = options.lane ?? laneIndex;
    const left = laneWidth * lane + laneWidth * (0.18 + Math.random() * 0.64);
    laneIndex = (laneIndex + 1) % laneCount;

    piece.style.left = `${left}%`;
    piece.style.top = `${options.startY ?? -18}px`;
    piece.style.setProperty("--c", pick(colors));
    piece.style.setProperty("--w", `${isRibbon ? 16 + Math.random() * 18 : 5 + Math.random() * 7}px`);
    piece.style.setProperty("--h", `${8 + Math.random() * 12}px`);
    piece.style.setProperty("--x", `${-44 + Math.random() * 88}px`);
    piece.style.setProperty("--d", `${6.5 + Math.random() * 5.5}s`);
    piece.style.setProperty("--rot", `${Math.random() * 220}deg`);
    piece.style.setProperty("--o", `${0.24 + Math.random() * 0.34}`);

    bg.appendChild(piece);
    setTimeout(() => piece.remove(), 12500);
  }

  function createSpark(x, y) {
    const now = performance.now();
    if (now - lastSpark < 55) return;
    lastSpark = now;

    const spark = document.createElement("span");
    spark.className = "birthday-spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty("--c", pick(colors));
    spark.style.setProperty("--s", `${4 + Math.random() * 7}px`);

    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 760);
  }

  for (let index = 0; index < 42; index += 1) {
    createConfettiPiece({
      lane: index % laneCount,
      startY: Math.random() * window.innerHeight
    });
  }

  setInterval(() => {
    createConfettiPiece();
    if (Math.random() > 0.45) {
      createConfettiPiece({ lane: Math.floor(Math.random() * laneCount) });
    }
  }, 220);

  document.addEventListener("pointermove", (event) => {
    createSpark(event.clientX, event.clientY);
  }, { passive: true });
})();
