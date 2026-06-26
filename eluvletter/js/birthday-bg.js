(function () {
  const bg = document.getElementById("birthdayBg");
  if (!bg) return;

  const colors = ["#ff74c7", "#C9E0EB", "#7392B5", "#8350C4", "#f6eddf"];
  const shapes = ["piece", "piece", "piece", "ribbon"];
  let lastSpark = 0;

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function createConfettiPiece() {
    const piece = document.createElement("span");
    const isRibbon = pick(shapes) === "ribbon";
    piece.className = `confetti-piece${isRibbon ? " ribbon" : ""}`;

    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--c", pick(colors));
    piece.style.setProperty("--w", `${isRibbon ? 16 + Math.random() * 18 : 5 + Math.random() * 7}px`);
    piece.style.setProperty("--h", `${8 + Math.random() * 12}px`);
    piece.style.setProperty("--x", `${-70 + Math.random() * 140}px`);
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

  for (let index = 0; index < 18; index += 1) {
    setTimeout(createConfettiPiece, index * 160);
  }

  setInterval(createConfettiPiece, 260);

  document.addEventListener("pointermove", (event) => {
    createSpark(event.clientX, event.clientY);
  }, { passive: true });
})();
