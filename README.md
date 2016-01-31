Kanvasku
=====

Kanvasku adalah sebuah alat untuk mengubah dari perintah-perintah bahasa Indonesia ke bahasa JavaScript (khususnya kanvas) untuk diubah ke bahasa mesin oleh peramban web yang digunakan.

##Gambaran Proses
```
	Perintah -> Kanvasku -> JavaScript
```

##Pemasangan
Cukup tambahkan kode berikut ke halaman web Anda:

Tambahkan di antara <head> dan </head>:
(Sesuaikan alamat ke berkas di mana kanvasku.min.js disimpan)
```html
	<script src="alamat/ke/berkas/kanvasku.min.js"></script>
```

Tambahkan ke tempat kanvas Anda:
```html
	<canvas id="kanvas1"></canvas>
	<script type="teks/kanvasku">
		gunakan kanvas #kanvas1
		siapkan kanvas
		
		isi segi empat 10 10 100 100
	</script>
```

Jika Anda memasangnya dengan benar, maka Anda akan mendapatkan persegi berwarna hitam dengan panjang sisi 100px.
Ganti perintah yang ada di dalam elemen `<script>` dengan perintah Anda. Baca dokumentasi untuk keterangan singkat tentang perintah-perintah Kanvasku.
