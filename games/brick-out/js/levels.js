const HUD_HEIGHT = 40;
let width = 600;
let height = 600;
let maxSpeed = 12;
const levels = [];

// Helper for generated levels: cols, rows, horizontal gap, vertical gap, brick height, layout
function mk(cols, rows, gapX, gapY, h, layout){
  const m = 30;
  return { row: rows, col: cols, w: (width - 2*m - (cols-1)*gapX) / cols, h: h, gapX: gapX, gapY: gapY, x: m, y: 30, layout: layout };
}

// 98 levels ordered from easy to hard.
// "orig" = hand-made levels by the author, the rest are generated and interleaved by difficulty score.

// Level 1 (author's original level 1, difficulty 20)
levels[1] = {
  row : 5,
  col : 8,
  w : (width - (40+7*5)) / 8,
  
  h : 20,
  gapX : 5,
  gapY : 5,
  x : 20,
  y : 40,
  layout : ["...RR...","..RRRR..","..G..G..",".RRRRRR.","..RRRR.."]
}

// Level 2 (checker t0, difficulty 24)
levels[2] = mk(8, 5, 6, 5, 23, ["R.R.R.R.",".R.G.R.R","R.G.G.R.",".R.G.R.R","R.R.R.R."]);

// Level 3 (hourglass t0, difficulty 24)
levels[3] = mk(8, 5, 6, 5, 23, [".RRRRRR.","..RGGR..","........","..RGGR..",".RRRRRR."]);

// Level 4 (author's original level 2, difficulty 28)
levels[4] = {
  row : 5,
  col : 8,
  w : (width - (40+7*5)) / 8,
  
  h : 20,
  gapX : 5,
  gapY : 5,
  x : 20,
  y : 40,
  layout : ["...GG...","..GRRG..",".GRRRRG.","..GRRG..","...GG..."]
}

// Level 5 (diagonals t0, difficulty 28)
levels[5] = mk(8, 5, 6, 5, 23, ["RR..RR..","G..GG..G","..RR..RR",".GG..GG.","RR..RR.."]);

// Level 6 (cross t0, difficulty 28)
levels[6] = mk(8, 5, 6, 5, 23, ["...GG...","...GG...","GGGGGGGG","...RR...","...RR..."]);

// Level 7 (noise t0, difficulty 28)
levels[7] = mk(8, 5, 6, 5, 23, ["RRR..RRR","G......G",".R.RR.R.","G..GG..G","R.RRRR.R"]);

// Level 8 (waves t0, difficulty 29)
levels[8] = mk(10, 5, 5, 5, 23, [".....RRR..","R...GGGRR.","R...G...R.","RRRGG...RR",".RRR.....R"]);

// Level 9 (diamond t0, difficulty 32)
levels[9] = mk(8, 5, 6, 5, 23, ["...RR...",".RRGGRR.","RRGGGGRR",".RRGGRR.","...RR..."]);

// Level 10 (pyramid t0, difficulty 34)
levels[10] = mk(8, 5, 6, 5, 23, ["...RR...","..GGGG..","..RRRR..",".GGGGGG.","RRRRRRRR"]);

// Level 11 (pixel-art t0, difficulty 36)
levels[11] = mk(8, 5, 6, 5, 23, [".R....R.",".RRGGRR.","RRGGGGRR","RRRGGRRR","..RRRR.."]);

// Level 12 (stripes t0, difficulty 40)
levels[12] = mk(8, 5, 6, 5, 23, ["GGGGGGGG","........","GGGGGGGG","........","RRRRRRRR"]);

// Level 13 (columns t0, difficulty 42)
levels[13] = mk(8, 5, 6, 5, 23, ["RR.RR.RR","GG.GG.GG","RR.RR.RR","GG.GG.GG","RR.RR.RR"]);

// Level 14 (frames t0, difficulty 42)
levels[14] = mk(8, 5, 6, 5, 23, ["GGGGGGGG","G......G","G.GGGG.G","R......R","RRRRRRRR"]);

// Level 15 (heart t0, difficulty 42)
levels[15] = mk(8, 5, 6, 5, 23, [".GG..GG.","GGGGGGGG",".GGGGGG.","..RRRR..","...RR..."]);

// Level 16 (author's original level 3, difficulty 54)
levels[16] = {
  row : 5,
  col : 8,
  w : (width - (40+7*5)) / 8,
  
  h : 20,
  gapX : 5,
  gapY : 5,
  x : 20,
  y : 40,
  layout : ["B..RR..B","BBB..BBB","GRGRRGRG","G..RR..G","B..GG..B"]
}

// Level 17 (funnel t0, difficulty 54)
levels[17] = mk(10, 5, 5, 5, 23, ["GGGGGGGGGG",".GGGGGGGG.","..GGGGGG..","...RRRR...","....RR...."]);

// Level 18 (arch t0, difficulty 54)
levels[18] = mk(10, 5, 5, 5, 23, ["RRRRRRRRRR","GGGGGGGGGG","RRR....RRR","GGG....GGG","RRR....RRR"]);

// Level 19 (diamond t1, difficulty 56)
levels[19] = mk(10, 5, 5, 5, 23, ["....BB....","..GGGGGG..","BGGGRRGGGB","..GGGGGG..","....BB...."]);

// Level 20 (cross t1, difficulty 56)
levels[20] = mk(10, 6, 5, 5, 23, ["....RR....","....RR....","GGGGGGGGGG","GGGGGGGGGG","....BB....","....BB...."]);

// Level 21 (stripes t1, difficulty 60)
levels[21] = mk(10, 6, 5, 5, 23, ["RRRRRRRRRR","..........","GGGGGGGGGG","..........","BBBBBBBBBB",".........."]);

// Level 22 (diagonals t1, difficulty 61)
levels[22] = mk(10, 6, 5, 5, 23, ["RB..RB..RB","R..BR..BR.","..RB..RB..",".BR..BR..B","RB..RB..RB","R..BR..BR."]);

// Level 23 (heart t1, difficulty 62)
levels[23] = mk(10, 6, 5, 5, 23, ["..RR..RR..",".RRRRRRRR.",".GGGGGGGG.",".GGGGGGGG.","..BBBBBB..",".........."]);

// Level 24 (checker t1, difficulty 64)
levels[24] = mk(10, 5, 5, 5, 23, ["B.B.B.B.B.",".B.G.G.G.B","B.G.R.G.G.",".B.G.G.G.B","B.B.B.B.B."]);

// Level 25 (hourglass t1, difficulty 64)
levels[25] = mk(10, 5, 5, 5, 23, [".BBBBBBBB.","...GGGG...","..........","...GGGG...",".BBBBBBBB."]);

// Level 26 (funnel t1, difficulty 68)
levels[26] = mk(12, 6, 4, 5, 23, ["RRRRRRRRRRRR",".RRRRRRRRRR.","..GGGGGGGG..","...GGGGGG...","....BBBB....",".....BB....."]);

// Level 27 (author's original level 4, difficulty 122)
levels[27] = {
  row : 6,
  col : 10,
  w : (width - (40+9*10)) / 10,
  
  h : 25,
  gapX : 10,
  gapY : 10,
  x : 20,
  y : 20,
  layout : ["PBGR..RGBG","BGR....RGB","GR..XX..RG","GR..XX..GR","BGR....RGB","PBGR..RGBP"]
}

// Level 28 (stripes t2, difficulty 72)
levels[28] = mk(10, 7, 5, 5, 23, ["RRRRRRRRRR","..........","RRGXGGXGRR","..........","RRGGGGGGRR","..........","RRRRRRRRRR"]);

// Level 29 (pyramid t1, difficulty 72)
levels[29] = mk(10, 6, 5, 5, 23, ["....RB....","...BRBR...","..RBRBRB..","..RBRBRB..",".BRBRBRBR.","RBRBRBRBRB"]);

// Level 30 (waves t1, difficulty 74)
levels[30] = mk(12, 5, 4, 5, 23, ["......BBBB..","B....GGGGG..","BB..GR...GB.","BBGGGG....BB",".BBBB......B"]);

// Level 31 (noise t1, difficulty 76)
levels[31] = mk(10, 6, 5, 5, 23, ["RB.BRBR.RB","R.RB..RB.B","RBR.RB.BRB","RBRB..RBRB",".B.B..R.R.","RB......RB"]);

// Level 32 (waves t2, difficulty 77)
levels[32] = mk(12, 6, 4, 5, 23, ["......RRR...",".....BBBBB..","R....RR..RR.","BB..BB....B.",".RRRR.....RR",".BBX....X..B"]);

// Level 33 (frames t1, difficulty 80)
levels[33] = mk(10, 6, 5, 5, 23, ["RRRRRRRRRR","R........R","G.GGGGGG.G","G.GGGGGG.G","B........B","BBBBBBBBBB"]);

// Level 34 (frames t2, difficulty 80)
levels[34] = mk(10, 7, 5, 5, 23, ["RRRRRRRRRR","R........R","R.GGGGGG.R","R.G....G.R","X.GGGGGG.X","R........R","RRRRRRRRRR"]);

// Level 35 (checker t2, difficulty 81)
levels[35] = mk(10, 6, 5, 5, 23, ["R.R.R.R.R.",".X.B.B.BXB","R.R.R.R.R.",".B.B.B.B.B","R.R.R.R.R.",".B.B.B.B.B"]);

// Level 36 (cross t2, difficulty 84)
levels[36] = mk(10, 7, 5, 5, 23, ["....RR....","....GG....","RRGGGGGGRR","RGGGBBGGGR","RRGXGGXGRR","....GG....","....RR...."]);

// Level 37 (pyramid t2, difficulty 86)
levels[37] = mk(10, 7, 5, 5, 23, ["....BB....","....BB....","...GGGG...","..GGGGGG..",".GGXGGXGG.",".RRRRRRRR.","RRRRRRRRRR"]);

// Level 38 (diamond t2, difficulty 86)
levels[38] = mk(10, 6, 5, 5, 23, ["....RR....","..BBBBBB..",".RRRXXRRR.",".BBBBBBBB.","..RRRRRR..","....BB...."]);

// Level 39 (hourglass t2, difficulty 86)
levels[39] = mk(10, 6, 5, 5, 23, [".RRRRRRRR.","..BBBBBB..","....XX....","....BB....","..RRRRRR..",".BBBBBBBB."]);

// Level 40 (author's original level 5, difficulty 72)
levels[40] = {
  row : 8,
  col : 12,
  w : (width - (80+11*0)) / 12,
  
  h : 10,
  gapX : 0,
  gapY : 10,
  x : 40,
  y : 30,
  layout : ["R.R.R.R.R.R.",".R.R.R.R.R.R","G.G.G.G.G.G.",".G.G.G.G.G.G","R.R.R.R.R.R.",".R.R.R.R.R.R","G.G.G.G.G.G.",".G.G.G.G.G.G"]
}

// Level 41 (columns t1, difficulty 90)
levels[41] = mk(10, 6, 5, 5, 23, ["RB.BR.RB.B","RB.BR.RB.B","RB.BR.RB.B","RB.BR.RB.B","RB.BR.RB.B","RB.BR.RB.B"]);

// Level 42 (diagonals t2, difficulty 92)
levels[42] = mk(10, 7, 5, 5, 23, ["BB..BB..BB","B..BB..BB.","..GG..GG..",".GG..GG..G","GX..GG..XG","R..RR..RR.","..RR..RR.."]);

// Level 43 (heart t2, difficulty 92)
levels[43] = mk(10, 7, 5, 5, 23, ["..RR..RR..",".RRGGGGRR.","RRGXGGXGRR",".GGGBBGGG.",".RGGGGGGR.","...GGGG...",".........."]);

// Level 44 (pixel-art t2, difficulty 94)
levels[44] = mk(10, 6, 5, 5, 23, ["..R....R..","..BBBBBB..",".RX.RR.XR.","BBBBBBBBBB","R.R....R.R","...BBBB..."]);

// Level 45 (funnel t2, difficulty 102)
levels[45] = mk(12, 7, 4, 5, 23, ["RRRRRRRRRRRR",".RRGGGGGGRR.","..GGXGGXGG..","...GBBBBG...","...GGGGGG...","....GGGG....",".....RR....."]);

// Level 46 (waves t3, difficulty 102)
levels[46] = mk(12, 7, 4, 5, 23, ["......GPG...","......GPGP..","G....XX..P..","G....P...PG.","GP..G.....GP",".PGPG......P","..GP.......P"]);

// Level 47 (waves t4, difficulty 106)
levels[47] = mk(12, 8, 4, 5, 23, [".......PP...","......PPP...",".....BB.BB..","B....B...BB.","B...BB....B.",".B..B.....BB",".GGXG...X..G","..GG.......G"]);

// Level 48 (pixel-art t1, difficulty 108)
levels[48] = mk(10, 5, 5, 5, 23, [".BBBBBBBB.","BB.GGGG.BB","BGGGRRGGGB","BB.GGGG.BB",".BBBBBBBB."]);

// Level 49 (author's original level 6, difficulty 76)
levels[49] = {
  row : 8,
  col : 8,
  w : (width - (80+7*5)) / 8,
  
  h : 25,
  gapX : 5,
  gapY : 5,
  x : 40,
  y : 15,
  layout : ["........","...PP...","..PPPP..","..PBBP..","..PBBP..","..PPPP..","...PP...","........"]
}

// Level 50 (author's original level 7, difficulty 120)
levels[50] = {
  row : 8,
  col : 12,
  w : (width - (80+11*0)) / 12,
  
  h : 10,
  gapX : 0,
  gapY : 10,
  x : 40,
  y : 30,
  layout : ["............","RRRRRRRRRRRR","............","GGGGGGGGGGGG","............","BBBBBBBBBBBB","............","PPPPPPPPPPPP"]
}

// Level 51 (noise t2, difficulty 116)
levels[51] = mk(10, 7, 5, 5, 23, ["B.BBBBBB.B",".BXBBBBXB.","G.GGGGGG.G",".GGGGGGGG.",".G......G.","R.RRRRRR.R","RR..RR..RR"]);

// Level 52 (arch t1, difficulty 120)
levels[52] = mk(12, 6, 4, 5, 23, ["RBRBRBRBRBRB","RBRBRBRBRBRB","RBRBRBRBRBRB","RBRB....RBRB","RBRB....RBRB","RBRB....RBRB"]);

// Level 53 (columns t2, difficulty 121)
levels[53] = mk(10, 7, 5, 5, 23, ["BB.BB.BB.B","BB.BB.BB.B","GG.GG.GG.G","GG.GG.GG.G","GG.GG.GG.G","RR.RR.RR.R","RR.RXXRR.R"]);

// Level 54 (waves t5, difficulty 129)
levels[54] = mk(12, 9, 4, 5, 23, [".......BB...","......BBB...","......B.BB..","B....B...B..","P....P....P.","PX..P.....X.",".P.PP.....PP",".PPPP......P","..PP.......P"]);

// Level 55 (author's original level 8, difficulty 110)
levels[55] = {
  row : 6,
  col : 7,
  w :70,
  h : 15,
  gapX : 10,
  gapY : 10,
  x : 30,
  y : 30,
  layout : ["RRRRRRR","BBBBBBB","RRRRRRR","GGGXGGG","BXBXBXB",".R.R.R."]
}

// Level 56 (checker t3, difficulty 140)
levels[56] = mk(12, 7, 4, 5, 23, ["G.G.G.G.G.G.",".P.X.P.PXP.P","G.G.G.G.G.G.",".P.P.P.P.P.P","G.G.G.G.G.G.",".P.P.P.P.P.P","G.G.G.G.G.G."]);

// Level 57 (hourglass t3, difficulty 150)
levels[57] = mk(12, 7, 4, 5, 23, [".PGPGPGPGPG.","..GPGPGPGP..","....GPGP....","............","....GPGP....","..GPGPGPGP..",".XGPGPGPGPX."]);

// Level 58 (stripes t4, difficulty 160)
levels[58] = mk(12, 9, 4, 5, 23, ["GGGGGGGGGGGG","............","GGGXGXXGXGGG","............","GGGGGGGGGGGG","............","GGGGGGGGGGGG","............","GGGGGGGGGGGG"]);

// Level 59 (arch t2, difficulty 164)
levels[59] = mk(12, 7, 4, 5, 23, ["BBBBBBBBBBBB","BBBBBBBBBBBB","GGGGXGGXGGGG","GGGG....GGGG","GGGG....GGGG","RRRR....RRRR","RRRR....RRRR"]);

// Level 60 (diagonals t4, difficulty 176)
levels[60] = mk(12, 9, 4, 5, 23, ["GG..GG..GG..","G..GB..BG..G","..BB..BB..GG",".GB..PP..BG.","GB..PP..BB..","G..XB..BX..G","..XB..BB.XGG",".GG..BB..GG.","GG..GG..GG.."]);

// Level 61 (diagonals t3, difficulty 178)
levels[61] = mk(12, 8, 4, 5, 23, ["GG..GG..GG..","G..GG..GG..G","..BB..BB..BB",".BB..XX..BB.","BB..BB..BB..","B..BB..BB..B","..PP..PP..PP",".XP..PP..PX."]);

// Level 62 (diamond t3, difficulty 180)
levels[62] = mk(12, 7, 4, 5, 23, [".....PG.....","...XGPGPX...",".XGPGPGPGPX.","GPGPGPGPGPGP",".PGPGPGPGPG.","...PGPGPG...",".....PG....."]);

// Level 63 (pixel-art t4, difficulty 184)
levels[63] = mk(12, 8, 4, 5, 23, ["..P......P..","...P....P...","..BBBBBBBB..",".BB.BBBB.BB.","BBBBXBBXBBBB","B.BBBBBBBB.B","G.G......G.G","...XG..GX..."]);

// Level 64 (checker t4, difficulty 186)
levels[64] = mk(12, 8, 4, 5, 23, ["P.P.P.P.P.P.",".P.P.P.P.P.P","X.B.B.B.B.BX",".X.B.B.B.BXB","B.B.B.B.B.B.",".B.B.B.B.B.B","G.G.G.G.G.G.",".G.G.G.G.G.G"]);

// Level 65 (frames t4, difficulty 188)
levels[65] = mk(12, 9, 4, 5, 23, ["GGGGGGGGGGGG","P..........P","G.GGGGGGGG.G","P.X......X.P","G.G.GGGG.G.G","P.P......P.P","G.GGGGGGGG.G","P..........P","XGGGGGGGGGGX"]);

// Level 66 (cross t3, difficulty 188)
levels[66] = mk(12, 8, 4, 5, 23, ["....PPPP....","....BBBB....","....BBBB....","PXBBBGGBBBXP","XPBBBGGBBBPX","....BBBB....","....BBBB....","....PPPP...."]);

// Level 67 (stripes t3, difficulty 190)
levels[67] = mk(12, 8, 4, 5, 23, ["PPPPPPPPPPPP","............","PPBBBBBBBBPP","............","PPBBBXXBBBPP","............","PPPPBBBBPPPP","............"]);

// Level 68 (heart t3, difficulty 196)
levels[68] = mk(12, 8, 4, 5, 23, ["............",".PPXBBBBXPP.",".XBBBBBBBBX.",".PBBBGGBBBP.",".PBBBGGBBBP.","..BBBBBBBB..","....BBBB....","............"]);

// Level 69 (pyramid t4, difficulty 204)
levels[69] = mk(12, 9, 4, 5, 23, [".....GG.....",".....XX.....","....BBBB....","...BBPPBB...","...BPPPPB...","..BBBPPBBB..",".GBBBBBBBBG.",".GXGBBBBGXG.","GGGGGGGGGGGG"]);

// Level 70 (diamond t4, difficulty 204)
levels[70] = mk(12, 8, 4, 5, 23, [".....PP.....","...PPXXPP...","..BBBBBBBB..","BBBBBBBBBBBB","BBBBBBBBBBBB","..BBBBBBBB..","...XGGGGX...",".....GG....."]);

// Level 71 (hourglass t4, difficulty 204)
levels[71] = mk(12, 8, 4, 5, 23, ["PPPPPPPPPPPP","..PPPPPPPP..","...BXBBXB...",".....XX.....",".....BB.....","...BBBBBB...","..GGGGGGGG..","GGGGGGGGGGGG"]);

// Level 72 (funnel t4, difficulty 208)
levels[72] = mk(12, 9, 4, 5, 23, ["GGGGGGGGGGGG",".PPPPPPPPPP.",".GGGGXXGGGG.","..PPPPPPPP..","...GGGGGG...","...XPPPPX...","....GGGG....",".....PP.....",".....GG....."]);

// Level 73 (heart t4, difficulty 216)
levels[73] = mk(12, 9, 4, 5, 23, ["............",".PPPPPPPPPP.",".GGGGXXGGGG.",".PPPPPPPPPP.",".GGGGGGGGGG.","..PPXPPXPP..","...GGGGGG...","....PPPP....","............"]);

// Level 74 (noise t3, difficulty 216)
levels[74] = mk(12, 8, 4, 5, 23, ["G.GGGGGGGG.G","..G.G..G.G..",".BBB....BBB.",".BBB.BB.BBB.","BB..BBBB..BB","BB.X.BB.X.BB",".PPPP..PPPP.","PPX.P..P.XPP"]);

// Level 75 (funnel t3, difficulty 218)
levels[75] = mk(12, 8, 4, 5, 23, ["PPPPPPPPPPPP",".PPPBBBBPPP.",".XBBBBBBBBX.","..BBBGGBBB..","...BBGGBB...","....BBBB....","....BBBB....",".....XX....."]);

// Level 76 (pyramid t3, difficulty 220)
levels[76] = mk(12, 8, 4, 5, 23, [".....GG.....","....GGGG....","....BBBB....","...BBBBBB...","..BBBBBBBB..",".BXBBXXBBXB.",".PPPPPPPPPP.","PPPPPPPPPPPP"]);

// Level 77 (cross t4, difficulty 220)
levels[77] = mk(12, 9, 4, 5, 23, ["....GGGG....","....PPPP....","....GGGG....","PPPPPPPPPPPP","GGGGGGGGGGGG","PPPPPXXPPPPP","....GGGG....","....PPPP....","....GXXG...."]);

// Level 78 (cross t5, difficulty 230)
levels[78] = mk(12, 10, 4, 5, 21, ["....BPBP....","....BPBP....","....BPBP....","....BPBP....","BPBPBPBPBPBP","BPBPBXXPBPBP","....BPBP....","....BPBP....","....BXXP....","....BPBP...."]);

// Level 79 (checker t5, difficulty 232)
levels[79] = mk(12, 9, 4, 5, 23, ["B.B.B.B.B.B.",".B.B.B.B.B.B","B.B.B.B.B.B.",".B.B.B.B.B.B","X.P.P.P.P.PX",".P.P.P.P.P.P","P.P.P.P.P.P.",".P.P.P.P.P.P","P.P.X.PXP.P."]);

// Level 80 (columns t3, difficulty 234)
levels[80] = mk(12, 8, 4, 5, 23, ["GG.GG.GG.GG.","GG.GG.GG.GG.","XB.BB.BB.BBX","BB.BB.BB.BB.","BB.BB.BB.BB.","XB.BB.BB.BBX","PP.PP.PP.PP.","PP.PP.PP.PP."]);

// Level 81 (frames t3, difficulty 236)
levels[81] = mk(12, 8, 4, 5, 23, ["PPPPPPPPPPPP","P..........P","P.BBBBBBBB.P","X.B......B.X","P.B......B.P","P.BBBBBBBB.P","P..........P","XPPPPPPPPPPX"]);

// Level 82 (columns t4, difficulty 242)
levels[82] = mk(12, 9, 4, 5, 23, ["GG.GG.GG.GG.","GG.GB.BB.GG.","GX.BB.BB.BX.","GG.BB.PB.BG.","GB.BP.PP.BB.","GG.BB.PB.BG.","GG.BB.BB.BG.","GG.XX.BXXGG.","GG.GG.GG.GG."]);

// Level 83 (stripes t5, difficulty 244)
levels[83] = mk(12, 10, 4, 5, 21, ["BPBPBPBPBPBP","............","BPBPBPBPBPBP","............","BPBPBPBPBPBP","............","BPBPBPBPBPBP","............","BPBXXPBXXPBP","............"]);

// Level 84 (hourglass t5, difficulty 244)
levels[84] = mk(12, 9, 4, 5, 23, ["BBBBBBBBBBBB","..XBBBBBBX..","...BBBBBB...","....BBBB....","............","....PPPP....","...PPPPPP...","..PPPPPPPP..","PPXPPPPPPXPP"]);

// Level 85 (diamond t5, difficulty 250)
levels[85] = mk(12, 9, 4, 5, 23, [".....BB.....","....BBBB....","..BBBXXBBB..",".BBBBBBBBBB.","PPPPPPPPPPPP",".PPPPPPPPPP.","..PPPPPPPP..","....PXXP....",".....PP....."]);

// Level 86 (pixel-art t3, difficulty 258)
levels[86] = mk(12, 7, 4, 5, 23, [".PGPGPGPGPG.","GPGPGPGPGPGP","GPGPGPGPGPGP","XPGPGPGPGPGX","G.GPGPGPGP.P","GXGP....GPXP",".PGPGPGPGPG."]);

// Level 87 (diagonals t5, difficulty 261)
levels[87] = mk(12, 10, 4, 5, 21, ["PP..PP..PP..","X..PP..PP..X","..PP..PP..PP",".PP..BB..PP.","PP..BB..BP..","P..BB..BB..P","..PP..BB..PP",".PX..PP..XP.","PP..PP..PP..","P..PP..PP..P"]);

// Level 88 (funnel t5, difficulty 265)
levels[88] = mk(12, 10, 4, 5, 21, ["BPBPBPBPBPBP",".PBPBXXPBPB.",".PBPXPBXBPB.","..BPBPBPBP..","..BPBPBPBP..","...PBPBPB...","....BPBP....","....BPBP....",".....PB.....",".....PB....."]);

// Level 89 (arch t3, difficulty 266)
levels[89] = mk(12, 8, 4, 5, 23, ["GGGGGGGGGGGG","GGGGGGGGGGGG","BBBBBBBBBBBB","BXBBBBBBBBXB","BBBB....BBBB","BBBB....BBBB","PPPP....PPPP","PPPX....XPPP"]);

// Level 90 (arch t4, difficulty 266)
levels[90] = mk(12, 9, 4, 5, 23, ["GGGGGGGGGGGG","GGGGBBBBGGGG","GGBBBBBBBBGG","GGBBBXXBBBGG","GBBB....BBBG","GGBB....BBGG","GGBX....XBGG","GGXG....GXGG","GGGG....GGGG"]);

// Level 91 (frames t5, difficulty 286)
levels[91] = mk(12, 10, 4, 5, 21, ["BPBPBPBPBPBP","B..........P","B.BPBPBPBP.P","X.B......P.X","B.B.BPBP.P.P","B.B.BPBP.P.P","B.B......P.P","X.BPBPBPBP.X","B..........P","BPBPBPBPBPBP"]);

// Level 92 (heart t5, difficulty 289)
levels[92] = mk(12, 10, 4, 5, 21, ["............",".PXXBPBPXXB.",".PBPBPBPBPB.",".PBPBPBPBPB.",".PBPXPBXBPB.",".PBPBPBPBPB.","..BPBPBPBP..","...PBPBPB...","....BPBP....","............"]);

// Level 93 (pyramid t5, difficulty 294)
levels[93] = mk(12, 10, 4, 5, 21, [".....PP.....",".....XX.....","....PPPP....","....BBBB....","...BBBBBB...","..PBBXXBBP..","..PPBBBBPP..",".XPPPPPPPPX.",".PPPPPPPPPP.","PPPPPPPPPPPP"]);

// Level 94 (noise t4, difficulty 294)
levels[94] = mk(12, 9, 4, 5, 23, ["G.GGGGGGGG.G","GGGGXBBXGGGG",".XBBBBBBBBX.",".GBBBPPBBBG.","GBB.PPPP.BBG","GGBBBPPBBBGG","GGBXBBBBXBGG","GGG..BB..GGG","G.GGG..GGG.G"]);

// Level 95 (columns t5, difficulty 362)
levels[95] = mk(12, 10, 4, 5, 21, ["PP.PP.PP.PP.","PX.PP.PP.PX.","PP.PP.PP.PP.","PP.PB.BB.PP.","PP.BB.BB.PP.","PP.BB.BB.PP.","XP.PB.BB.PPX","PP.XP.PPXPP.","PP.PP.PP.PP.","PP.PP.PP.PP."]);

// Level 96 (pixel-art t5, difficulty 368)
levels[96] = mk(12, 9, 4, 5, 23, [".BBBBBBBBBB.","BBBBBBBBBBBB","XB..BBBB..BX","BBBBBBBBBBBB","PPPPPPPPPPPP","P.PPXPPXPP.P","PP..PPPP..PP","PPPP....PPPP",".PPPPXXPPPP."]);

// Level 97 (arch t5, difficulty 452)
levels[97] = mk(12, 10, 4, 5, 21, ["PPPPPPPPPPPP","PPPPPPPPPPPP","PPPXPPPPXPPP","PPPPBBBBPPPP","XPPBBBBBBPPX","XPPB....BPPX","PPPP....PPPP","PPPP....PPPP","PPXP....PXPP","PPPP....PPPP"]);

// Level 98 (noise t5, difficulty 454)
levels[98] = mk(12, 10, 4, 5, 21, ["PPPPPPPPPPPP",".P.PP..PP.P.","P..PP..PP..P","PPPPBBBBPPPP","PPPBB..BBPPP","PPPBBBBBBPPP","PPXPBBBBPXPP","PPPXP..PXPPP","PPPPP..PPPPP","XPPPXPPXPPPX"]);

