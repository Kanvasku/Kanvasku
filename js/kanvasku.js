/**
 *  kanvasku.js

    Kanvasku adalah sebuah alat untuk mengubah dari perintah-perintah bahasa
    Indonesia ke bahasa JavaScript.

    Hak Cipta (C) 2016 Muhammad Rifqi Priyo Susanto (srifqi) dan kontributor

    Program ini adalah perangkat lunak gratis: Anda dapat mendistribusikan
    ulang dan/atau mengubah dengan ketentuan dari GNU General Public License
    sesuai yang dipublikasikan oleh the Free Software Foundation; baik
    Lisensi versi 3, atau (pada pilihan Anda) versi setelahnya.

    Program ini didistribusikan denagn harapan akan berguna, tetapi TANPA
    GARANSI APAPUN; bahkan tanpa menyiratkan garansi dari DAPAT DIJUALBELIKAN
    atau KEMAMPUAN UNTUK TUJUAN TERTENTU.  Lihat the GNU General Public License
    untuk detil lebih (bahasa Inggris).

    Anda seharusnya mendapatkan sebuah salinan dari the GNU General Public
    License bersama program ini.  Jika tidak, lihat
    <http://www.gnu.org/licenses/>.

 */

// Variabel global Kanvasku
var Kanvasku = {
	REVISI : 1,
	daftarSkrip : []
};

// Mengubah ke sudut dalam satuan radian
Kanvasku.sudut = function (sudut) {
	var m = /(.+) *(derajat|radian)/i.exec(sudut.toLowerCase());
	sudut = m[1];
	if (m[2] === "derajat") {
		return sudut * Math.PI / 180;
	} else if (m[2] === "radian") {
		// Sudah dalam bentuk radian
		return sudut;
	} else {
		// Mungkin sudah dalam bentuk radian?
		return sudut;
	}
};

Kanvasku.beritahuKesalahan = function (perintah) {
	throw new Error("perintah \"" + perintah + "\" tidak diketahui atau tidak tepat.");
};

Kanvasku.prosesSkrip = function (skrip, jalankan) {
	var perintah = skrip.split("\n");
	var JS = "";
	for (var i = 0; i < perintah.length; i++) {
		if (/^[\t]*$/i.test(perintah[i]))
			continue;
		var ketemu = false;
		for (var o = 0; o < Kanvasku.daftarPerintah.length; o++) {
			if (Kanvasku.daftarPerintah[o][0].test(perintah[i]) === true) {
				ketemu = true;
				JS += Kanvasku.daftarPerintah[o][1](
					Kanvasku.daftarPerintah[o][0].exec(perintah[i]));
			}
		}
		if (ketemu === false) {
			Kanvasku.beritahuKesalahan(perintah[i]);
		}
	}
	if (jalankan) {
		eval(JS);
	}
	return JS;
};

Kanvasku.prosesSemuaSkrip = function () {
	for (var i = 0; i < Kanvasku.daftarSkrip.length; i++) {
		Kanvasku.prosesSkrip(Kanvasku.daftarSkrip[i].innerText, true);
	}
};

Kanvasku.daftarPerintah = [
	[/gunakan kanvas #(.+)/i, function (perintah) {
			return "var b=document.getElementById('" + perintah[1] + "');";
		}
	],
	[/siapkan kanvas/i, function (perintah) {
			return "var c=b.getContext('2d');";
		}
	],
	// Untuk mengatur nilai tiap atribut, kita akan gunakan kata "atur" sebagai awalan.
	[/atur (.+)/i, function (perintah) {
			var a = perintah[1];
			var R = {
				fillStyle : /warna isian (.+)/i, // String: CSS Color
				font : /font (.+)/i, // String: size + typeface
				globalAlpha : /alfa global (.+)/i, // Number
				globalCompositeOperation : /operasi komposit global (.+)/i, // String: ...
				lineCap : /akhir garis (.+)/i, // String: butt, round, square
				lineDashOffset : /pergeseran garis putus (.+)/i, // Number
				lineJoin : /sambungan garis (.+)/i, // String: bevel, round, miter
				lineWidth : /lebar garis (.+)/i, // Number
				miterLimit : /batas siku (.+)/i, // Number
				resetTransform : /ulang transformasi kanvas/i,
				setLineDash : /garis putus (.+)/i, // Array
				shadowBlur : /kekaburan bayangan (.+)/i, // Number
				shadowColor : /warna bayangan (.+)/i, // String: CSS Color
				shadowOffsetX : /pergeseran X bayangan (.+)/i, // Number
				shadowOffsetY : /pergeseran Y bayangan (.+)/i, // Number
				strokeStyle : /warna goresan (.+)/i, // String: CSS Color
				textAlign : /perataan teks (.+)/i, // String: start, ...
				textBaseline : /alas teks (.+)/i, // String: alphabetic, ...
				widthheight : /ukuran kanvas (.+) (.+)/i//
			};
			var V = {
				lineCap : ["butt", "round", "square"],
				lineCapID : ["pangkal", "bulat", "persegi"],
				lineJoin : ["bevel", "round", "miter"],
				lineJoinID : ["segitiga", "bulat", "persegi"],
				textAlign : ["left", "right", "center", "start", "end"],
				textAlignID : ["kiri", "kanan", "tengah", "mulai", "akhir"],
				textBaseline : ["top", "hanging", "middle", "alphabetic", "ideographic", "bottom"],
				textBaselineID : ["atas", "menggantung", "tengah", "abjad", "ideografis", "bawah"]
			};
			for (var key in R) {
				if (R[key].test(a) === true) {
					var param = R[key].exec(a)[1];
					var param2 = R[key].exec(a)[2];
					switch (key) {
					case "fillStyle":
					case "font":
					case "shadowColor":
					case "strokeStyle":
						return "c." + key + "='" + param + "';";
					case "resetTransform":
						return "c.resetTransform();";
					case "globalCompositeOperation":
						return "c.globalCompositeOperation='" + param + "';";
					case "lineCap":
						param =
							V.lineCap.indexOf(param) < 0 ? (
								V.lineCapID.indexOf(param) < 0 ?
								param :
								V.lineCap[V.lineCapID.indexOf(param)]) :
							param;
						return "c.lineCap='" + param + "';";
					case "lineJoin":
						param =
							V.lineJoin.indexOf(param) < 0 ? (
								V.lineJoinID.indexOf(param) < 0 ?
								param :
								V.lineJoin[V.lineJoinID.indexOf(param)]) :
							param;
						return "c.lineJoin='" + param + "';";
					case "textAlign":
						param =
							V.textAlign.indexOf(param) < 0 ? (
								V.textAlignID.indexOf(param) < 0 ?
								param :
								V.textAlign[V.textAlignID.indexOf(param)]) :
							param;
						return "c.textAlign='" + param + "';";
					case "textBaseline":
						param =
							V.textBaseline.indexOf(param) < 0 ? (
								V.textBaselineID.indexOf(param) < 0 ?
								param :
								V.textBaseline[V.textBaselineID.indexOf(param)]) :
							param;
						return "c.textBaseline='" + param + "';";
					case "setLineDash":
						return "c.setLineDash([" + param.split(/ +/) + "]);";
					case "widthheight":
						return "c.width=" + param + ";c.height=" + param2 + ";";
					default:
						return "c." + key + "=" + param + ";";
					}
				}
			}
			Kanvasku.beritahuKesalahan(perintah[0]);
			return "";
		}
	],
	[/bersihkan( segi empat)? (.+) (.+) (.+) (.+)/i, function (perintah) {
			return "c.clearRect(" + perintah[2] + "," + perintah[3] + "," + perintah[4] + "," + perintah[5] + ");";
		}
	],
	[/isi( (.+)|$)/i, function (perintah) {
			var a = perintah[2];
			var R = {
				fillRect : /segi empat (.+) (.+) (.+) (.+)/i,
				fillText : /teks (".+") (.+) (.+)/i
			};
			if (perintah[1] === "") {
				return "c.fill();";
			} else if (R.fillRect.test(a) === true) {
				var arg = R.fillRect.exec(a);
				return "c.fillRect(" + arg[1] + "," + arg[2] + "," + arg[3] + "," + arg[4] + ");";
			} else if (R.fillText.test(a) === true) {
				var arg = R.fillText.exec(a);
				return "c.fillText(" + arg[1] + "," + arg[2] + "," + arg[3] + ");";
			}
			Kanvasku.beritahuKesalahan(perintah[0]);
			return "";
		}
	],
	[/gores( (.+)|$)/i, function (perintah) {
			var a = perintah[2];
			var R = {
				strokeRect : /segi empat (.+) (.+) (.+) (.+)/i,
				strokeText : /teks (".+") (.+) (.+)/i
			};
			if (perintah[1] === "") {
				return "c.stroke();";
			} else if (R.strokeRect.test(a) === true) {
				var arg = R.strokeRect.exec(a);
				return "c.strokeRect(" + arg[1] + "," + arg[2] + "," + arg[3] + "," + arg[4] + ");";
			} else if (R.strokeText.test(a) === true) {
				var arg = R.strokeText.exec(a);
				return "c.strokeText(" + arg[1] + "," + arg[2] + "," + arg[3] + ");";
			}
			Kanvasku.beritahuKesalahan(perintah[0]);
			return "";
		}
	],
	[/(mulai|tutup) garis/i, function (perintah) {
			var a = perintah[1];
			if (a === "mulai") {
				return "c.beginPath();";
			} else if (a === "tutup") {
				return "c.closePath();";
			}
		}
	],
	[/garis (lingkaran|elips|segi empat) (.+)/i, function (perintah) {
			var a = perintah[1];
			var b = perintah[2];
			if (a === "lingkaran") {
				if (/(.+) (.+) (.+) (.+) (.+)/i.test(b)) {
					var c = /(.+) (.+) (.+) (.+) (.+)/i.exec(b);
					return "c.arc(" + c[1] + "," + c[2] + "," + c[3] + "," + Kanvasku.sudut(c[4]) + "," + Kanvasku.sudut(c[5]) + ");";
				} else {
					Kanvasku.beritahuKesalahan(perintah[0]);
				}
			} else if (a === "elips") {
				if (/(.+) (.+) (.+) (.+) (.+) (.+) (.+)/i.test(b)) {
					var c = /(.+) (.+) (.+) (.+) (.+) (.+) (.+)/i.exec(b);
					return "c.ellipse(" + c[1] + "," + c[2] + "," + c[3] + "," + c[4] + "," + Kanvasku.sudut(c[5]) + "," + Kanvasku.sudut(c[6]) + "," + Kanvasku.sudut(c[7]) + ");";
				} else {
					Kanvasku.beritahuKesalahan(perintah[0]);
				}
			} else if (a === "segi empat") {
				if (/(.+) (.+) (.+) (.+)/i.test(b)) {
					var c = /(.+) (.+) (.+) (.+)/i.exec(b);
					return "c.rect(" + c[1] + "," + c[2] + "," + c[3] + "," + c[4] + ");";
				} else {
					Kanvasku.beritahuKesalahan(perintah[0]);
				}
			}
		}
	],
	[/(garis busur|geser|garis|kurva Bezier|kurva kuadrat) ke (.+)$/i, function (perintah) {
			var a = perintah[1].toLowerCase();
			var b = perintah[2];
			if (a === "garis busur") {
				if (/(.+) (.+) (.+) (.+) (.+)/i.test(b)) {
					var c = /(.+) (.+) (.+) (.+) (.+)/i.exec(b);
					return "c.arcTo(" + c[1] + "," + c[2] + "," + c[3] + "," + c[4] + "," + c[5] + ");";
				} else {
					Kanvasku.beritahuKesalahan(perintah);
				}
			} else if (a === "geser") {
				if (/(.+) (.+)/i.test(b)) {
					var c = /(.+) (.+)/i.exec(b);
					return "c.moveTo(" + c[1] + "," + c[2] + ");";
				} else {
					Kanvasku.beritahuKesalahan(perintah[0]);
				}
			} else if (a === "garis") {
				if (/(.+) (.+)/i.test(b)) {
					var c = /(.+) (.+)/i.exec(b);
					return "c.lineTo(" + c[1] + "," + c[2] + ");";
				} else {
					Kanvasku.beritahuKesalahan(perintah[0]);
				}
			} else if (a === "kurva bezier") {
				if (/(.+) (.+) (.+) (.+) (.+) (.+)/i.test(b)) {
					var c = /(.+) (.+) (.+) (.+) (.+) (.+)/i.exec(b);
					return "c.bezierCurveTo(" + c[1] + "," + c[2] + "," + c[3] + "," + c[4] + "," + c[5] + "," + c[6] + ");";
				} else {
					Kanvasku.beritahuKesalahan(perintah[0]);
				}
			} else if (a === "kurva kuadrat") {
				if (/(.+) (.+) (.+) (.+)/i.test(b)) {
					var c = /(.+) (.+) (.+) (.+)/i.exec(b);
					return "c.quadraticCurveTo(" + c[1] + "," + c[2] + "," + c[3] + "," + c[4] + ");";
				} else {
					Kanvasku.beritahuKesalahan(perintah[0]);
				}
			}
		}
	],
	[/(putar|skala|geser) kanvas (.+)$/i, function (perintah) {
			var a = perintah[1].toLowerCase();
			var b = perintah[2];
			if (a === "putar") {
				if (/(.+) (derajat|radian)/i.test(b)) {
					return "c.rotate(" + Kanvasku.sudut(b) + ");";
				} else {
					Kanvasku.beritahuKesalahan(perintah[0]);
				}
			} else if (a === "skala") {
				if (/(.+) (.+)/i.test(b)) {
					var c = /(.+) (.+)/i.exec(b);
					return "c.scale(" + c[1] + "," + c[2] + ");";
				} else {
					Kanvasku.beritahuKesalahan(perintah[0]);
				}
			} else if (a === "geser") {
				if (/(.+) (.+)/i.test(b)) {
					var c = /(.+) (.+)/i.exec(b);
					return "c.translate(" + c[1] + "," + c[2] + ");";
				} else {
					Kanvasku.beritahuKesalahan(perintah[0]);
				}
			}
		}
	],
	[/(simpan|muat) pengaturan$/i, function (perintah) {
			var a = perintah[1].toLowerCase();
			if (a === "simpan") {
				return "c.save();";
			} else if (a === "muat") {
				return "c.restore();";
			}
		}
	]
];

// Cari skrip kanvasku saat laman dimuat.
window.addEventListener("load", function () {
	// Mencari elemen <script> dengan tipe text/kanvasku atau teks/kanvasku.
	var daftarSkrip = document.getElementsByTagName("script");
	for (var i = 0; i < daftarSkrip.length; i++) {
		var skrip = daftarSkrip[i];
		if (/te(ks|xt)\/kanvasku/i.test(skrip.type)) {
			Kanvasku.daftarSkrip.push(skrip);
		}
	}

	Kanvasku.prosesSemuaSkrip();
});
