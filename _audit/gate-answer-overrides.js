/* Answer-key repairs for the legacy GATE Physics imports.
 * MCQ values are zero-based option indexes; NAT values are answer ranges.
 * The source question records remain authoritative for text and images.
 */
(function () {
  const keys = {
    gate2017: [
      'C','11.25 to 11.34','41.60 to 42.00','8.80 to 8.90','39.30 to 39.50','A','2.50 to 2.55','A','D','B','14.10 to 14.20','C','B','C','3.13 to 3.15','1.30 to 1.34','D','A','D','C','B','A','D','B','A','1.72 to 1.75','D','87.50 to 89.50','0.15 to 0.19','D','2.32 to 2.40','0.90 to 1.10','A','0.10 to 0.12','B','2.35 to 2.45','0.27 to 0.31','0.43 to 0.45','2.90 to 3.10','C','D','3.30 to 3.35','1.30 to 1.36','C','29.50 to 30.10','B','A','A','C','0.32 to 0.36','B','4.75 to 5.01','9.80 to 10.20','0.51 to 0.53','0.99 to 1.10',
      'C','A','B','A','D','A','D','C','C','B'
    ],
    gate2018: ['A','C','B','C','D','A','C','D','C','A','A','B','C','D','D','B','C','B','D','C','A','A','A','C','B','C','B','D','0.185 to 0.189','-3.7 to -3.5','4','1.8','6','1','297.0 to 300.1','D','C','A','A','C','B','A','C','D','A','B','C','1.55 to 1.58','0.70 to 0.73','0.28 to 0.31','1.6','24.4 to 27.6','2','0.81 to 0.84','81.60 to 81.80','0.21 to 0.23','0.78 to 0.82','6.5 to 6.7','6.1 to 6.3','0.25','466 to 467','256','0.41 to 0.43','1.51 to 1.53','78 to 90'],
    gate2019: ['C','A','C','B','D','D','D','D','A','C',
      'A','B','D','A','D','B','D','C','B','D','A','B','D','A','D','C',
      '1 to 1','7 to 7','5 to 5','3 to 3','2 to 2','-2 to -2','0.5 to 0.5','14 to 15','1 to 1',
      'A','C','D','C','B','A','D','A','D','D','C','C','A','B',
      '4 to 4','6 to 6','8 to 8','0 to 0','2 to 2','-270 to 270','1 to 1','2 to 2','-1 to -1','0 to 0','0.706 to 0.708','3 to 3','6999 to 6999','14 to 14','0.5 to 0.5','1 to 1']
  };
  const option = { A: 0, B: 1, C: 2, D: 3 };
  for (const [paperId, key] of Object.entries(keys)) {
    const paper = window.GATE_EXTRACTED_BANKS?.[paperId];
    if (!paper) continue;
    const questions = paper.questions || [];
    if (paperId === 'gate2017') {
      // The imported 2017 source is missing original Q38; do not shift its image/text.
      questions.forEach(q => {
        if (q.raw_n === 38 || key[q.raw_n - 1] === undefined) return;
        const value = key[q.raw_n - 1];
        q.type = option[value] === undefined ? 'nat' : 'mcq';
        q.ans = option[value] ?? value;
        if (q.type === 'nat') q.ans_raw = value;
      });
      continue;
    }
    questions.forEach(q => {
      const index = q.n - 1;
      const value = key[index];
      if (value !== undefined) {
        q.type = option[value] === undefined ? 'nat' : 'mcq';
        q.ans = option[value] ?? value;
        if (q.type === 'nat') q.ans_raw = value;
      }
    });
  }
})();
