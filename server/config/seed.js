/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Gallery = require('../api/gallery/gallery.model');
var Typeofservice = require('../api/type_of_service/typeofservice.model');
var Typeofbreaktime = require('../api/type_of_breaktime/typeofbreaktime.model');
var Role = require('../api/role/role.model');
var City = require('../api/city/city.model');
var Province = require('../api/province/province.model');
var HandsetType = require('../api/handset_type/handset_type.model');
var TaggingTransaction = require('../api/tagging_transaction/tagging_transaction.model');
var CustomerTaggingTransaction = require('../api/customer_tagging_transaction/customer_tagging_transaction.model');
var CustomerTicket = require('../api/cst_ticket/cst_ticket.model');
var Configuration = require('../api/configuration/configuration.model');
var UserActivity = require('../api/user_activity/user_activity.model');


 Configuration.find({}).remove(function() {
   Configuration.create(
     {
       name : 'URL API Zsmart',
       scope: 'ZSMART_API',
       key: 'API_URL',
       value: '10.14.14.34'
     },
     {
       name : 'SMTP GMAIL USER',
       scope: 'SMTP',
       key: 'smtp_user',
       value: 'indraespada02@gmail.com'
     },
     {
       name : 'SMTP GMAIL PASSWORD',
       scope: 'SMTP',
       key: 'smtp_password',
       value: 'kodedankopi'
     },
     {
       name : 'EMAIL TEMPLATE',
       scope: 'EMAIL_TEMPLATE',
       key: 'template',
       value: '<p>Hi, {{customer}}!</p> <br><p>You are receiving this mail becouse you request to recovery your Mobile Smarfren Queueing System password.</p><br><br><p>Please input this code below to recovery your password:</p><br><br><p>Recovery Code : {{uniqcode}}</p> <br><br><p>If you never request to recover your Mobile Smartfren Queueing System password then ignore this mail.</p><br><br><p> Thank You </p>'
     },
     {
       name : 'EMAIL SUBJECT',
       scope: 'EMAIL_TEMPLATE',
       key: 'subject',
       value: 'Smartfren Mobile Queueing System | Forgot Password'
     },
     {
       name : 'EMAIL FROM',
       scope: 'EMAIL_TEMPLATE',
       key: 'from',
       value: 'indraespada02@gmail.com'
     },
     {
       name : 'GALLERY NEAR ME DISTANCE',
       scope: 'GALLERY',
       key: 'distance',
       value: '2'
     }
   );
 });
 UserActivity.find({}).remove(function() {
 
 });
 HandsetType.find({}).remove(function() {
   HandsetType.create(
     {
       name : 'Andromax C',
     },
     {
       name : 'Andromax U',
     }
   );
 });
 Typeofbreaktime.find({}).remove(function() {
   Typeofbreaktime.create(
     {
       name : 'Solat',
       time : 15
     },
     {
       name : 'Ke Kamar Kecil',
       time : 5
     },
     {
       name : 'Istirahat',
       time : 30
     }
   );
 });
 TaggingTransaction.find({}).remove(function() {
   TaggingTransaction.create(
     {
       tagging_code : 'SLSGA01AA',
       level_1 : 'SALES',
       level_2 : 'Gallery',
       level_3 : 'Penjualan Melalui Gallery Berhasil',
       level_4 : 'Handset',
       sla : 2
     },
     {
       tagging_code : 'PAYPB01',
       level_1 : 'CASHIER PAYMENT',
       level_2 : 'Products',
       level_3 : 'Pembayaran Pembelian Produk (Modem, Bunlding, dsb)',
       level_4 : '',
       sla : 3
     },
     {
       tagging_code : 'CRSSE01',
       level_1 : 'CROSS SELLING / UP SELLING',
       level_2 : 'Service',
       level_3 : 'Berlangganan Fitur',
       level_4 : '',
       sla : 2
     },
     {
       tagging_code : 'IFOPF02AR',
       level_1 : 'INFORMASI',
       level_2 : 'Info Produk & Fitur Layanan',
       level_3 : 'Info Fitur',
       level_4 : 'Layanan Internet',
       sla : 1
     },
     {
       tagging_code : 'PURAK01AA',
       level_1 : 'PURNA JUAL',
       level_2 : 'Aktifasi',
       level_3 : 'Aktivasi Nomor Smartfren  (AFS)',
       level_4 : 'Aktifasi Paskabayar',
       sla : 2
     },
     {
       tagging_code : 'KELHPA02',
       level_1 : 'KELUHAN',
       level_2 : 'Permasalahan Nomor Smartfren - Paskabayar ',
       level_3 : 'Masalah Deaktivasi - Nomor Paskabayar',
       level_4 : '',
       sla : 2
     }
   );
 });
 CustomerTaggingTransaction.find({}).remove(function() {

 });  
 CustomerTicket.find({}).remove(function() {
   CustomerTicket.create(
     {
       ticket_type: 'Mobile',
       book_code: '000145',
       gallery: 'Gallery Mangga 2',
       date: '2016-04-11',
       time: '13:30',
       type_of_service: 'Cashier',
       customer: 'Indra',
       status: 'waiting',
       queueing_number: 2
     },
     {
       ticket_type: 'Mobile',
       book_code: '000144',
       gallery: 'Gallery Mangga 2',
       date: '2016-04-11',
       time: '13:31',
       type_of_service: 'Cashier',
       customer: 'Ayu',
       status: 'waiting',
       queueing_number: 1
     },
     {
       ticket_type: 'Mobile',
       book_code: '000146',
       gallery: 'Gallery Mangga 2',
       date: '2016-04-11',
       time: '13:31',
       type_of_service: 'Cashier',
       customer: 'Bresti',
       status: 'waiting',
       queueing_number: 3
     },
     {
       ticket_type: 'Regular',
       book_code: '',
       gallery: 'Gallery Mangga 2',
       date: '2016-04-11',
       time: '',
       type_of_service: 'Cashier',
       customer: 'Ayu',
       status: 'waiting',
       queueing_number: 2
     },
     {
       ticket_type: 'Regular',
       book_code: '',
       gallery: 'Gallery Mangga 2',
       date: '2016-04-18',
       time: '',
       type_of_service: 'Cashier',
       customer: 'Yuli',
       status: 'process',
       queueing_number: 1,
       counter: '1'

     },
     {
       ticket_type: 'Regular',
       book_code: '',
       gallery: 'Gallery Mangga 2',
       date: '2016-04-18',
       time: '',
       type_of_service: 'Cashier',
       customer: 'Angga',
       status: 'process',
       queueing_number: 2,
       counter: '2'
     },
     {
       ticket_type: 'Regular',
       book_code: '',
       gallery: 'Gallery Mangga 2',
       date: '2016-04-18',
       time: '',
       type_of_service: 'Cashier',
       customer: 'Yuda',
       status: 'process',
       queueing_number: 3,
       counter: '3'
     },
     {
       ticket_type: 'Regular',
       book_code: '',
       gallery: 'Gallery Mangga 2',
       date: '2016-04-18',
       time: '',
       type_of_service: 'Cashier',
       customer: 'Nila',
       status: 'waiting',
       queueing_number: 4,
       counter: ''
     }

   );
 });

 Gallery.find({}).remove(function() {
   Gallery.create(
     {
       name : 'Gallery Mangga 2',
       city : 'Kota Jakarta Pusat',
       province : 'DKI Jakarta',
       address : 'Mangga 2',
       location : [106.825824, -6.136231],
       counter_count : 4,
       running_text : "RUNNING TEXT MANGGA DUA..",
       type_of_service : [{ name : "Cashier", sla : 5}, { name : "Sales", sla : 6 }, { name : "Experience Zone" , sla : 5},  { name : "Customer Service" , sla : 5}],
       open_days : [
         { day : "Senin - Jumat", start_work : "09:00", end_work : "20:00" },
         { day : "Sabtu", start_work : "09:00", end_work : "20:00" }
       ],
       picture : ['gallery1.jpg','gallery2.jpg'],
       promo: '<p>Andromax Special Promo</p><ul><li> - Andromax c3 = Rp599rb <li><li> - New Andromax G2 = Rp699rb <li><li> - Andromax U = Rp1199rb <li></ul>',
       is_opened : false,
       active : false,
     },
     {
       name : 'Gallery BEC',
       city : 'Kota Bandung',
       address : 'BEC Bandung',
       location : [107.630074, -6.893790],
       counter_count : 3,
       running_text : "RUNNING TEXT MANGGA DUA..",
       type_of_service : [{ name : "Cashier", sla : 5}, { name : "Sales", sla : 5 }, { name : "Experience Zone" , sla : 5}, { name : "Customer Service" , sla : 5}],
       province : 'Jawa Barat',
       open_days : [
         { day : "Senin - Jumat", start_work : "09:00", end_work : "20:00" },
         { day : "Sabtu", start_work : "09:00", end_work : "20:00" }
       ],
       picture : ['gallery1.jpg','gallery2.jpg'],
       promo: '<p>Andromax Special Promo</p><ul><li> - Andromax c3 = Rp599rb <li><li> - New Andromax G2 = Rp699rb <li><li> - Andromax U = Rp1199rb <li></ul>',
       is_opened : false,
       active : false,
     }
   );
 });
 Typeofservice.find({}).remove(function() {
   Typeofservice.create(
     {
       name : 'Cashier',
       tag : 'A',
       description : '-',
       active : true,
     },
     {
       name : 'Customer Service',
       tag : 'B',
       description : '-',
       active : true,
     },
     {
       name : 'Experience Zone',
       tag : 'C',
       description : '-',
       active : true,
     },
     {
       name : 'Sales',
       tag : 'D',
       description : '-',
       active : true,
     }
   );
 });
 Role.find({}).remove(function() {
   Role.create(
     {
       name : 'Admin',
       description : '-',
       active : true,
     },
     {
       name : 'Supervisor',
       description : '-',
       active : true,
     },
     {
       name : 'Agent',
       description : '-',
       active : true,
     },
     {
       name : 'Eksekutif Manager',
       description : '-',
       active : true,
     }
   );
 });
 User.find({}).remove(function() {
   User.create({
     provider: 'local',
     nik: '1',
     name: 'Test User',
     email: 'test@test.com',
     password: 'test'
   }, {
     provider: 'local',
     nik: '2',
     role: 'admin',
     name: 'Admin',
     email: 'admin@admin.com',
     password: 'admin'
   },
   {
     provider: 'local',
     nik: '3',
     role: 'admin',
     name: 'Indra',
     email: 'indra@admin.com',
     password: 'admin'
   },
   function() {
       console.log('finished populating users..');
     }
   );
 });
 Province.find({}).remove(function() {
   Province.create(
     {
       "name": "Nanggroe Aceh Darussalam"
     },
     {
       "name": "Sumatera Utara"
     },
     {
       "name": "Sumatera Barat"
     },
     {
       "name": "Riau"
     },
     {
       "name": "Kepulauan Riau"
     },
     {
       "name": "Kepulauan Bangka-Belitung"
     },
     {
       "name": "Jambi"
     },
     {
       "name": "Bengkulu"
     },
     {
       "name": "Sumatera Selatan"
     },
     {
       "name": "Lampung"
     },
     {
       "name": "Banten"
     },
     {
       "name": "DKI Jakarta"
     },
     {
       "name": "Jawa Barat"
     },
     {
       "name": "Jawa Tengah"
     },
     {
       "name": "Daerah Istimewa Yogyakarta"
     },
     {
       "name": "Jawa Timur"
     },
     {
       "name": "Bali"
     },
     {
       "name": "Nusa Tenggara Barat"
     },
     {
       "name": "Nusa Tenggara Timur"
     },
     {
       "name": "Kalimantan Barat"
     },
     {
       "name": "Kalimantan Tengah"
     },
     {
       "name": "Kalimantan Selatan"
     },
     {
       "name": "Kalimantan Timur"
     },
     {
       "name": "Gorontalo"
     },
     {
       "name": "Sulawesi Selatan"
     },
     {
       "name": "Sulawesi Tenggara"
     },
     {
       "name": "Sulawesi Tengah"
     },
     {
       "name": "Sulawesi Utara"
     },
     {
       "name": "Sulawesi Barat"
     },
     {
       "name": "Maluku"
     },
     {
       "name": "Maluku Utara"
     },
     {
       "name": "Papua Barat"
     },
     {
       "name": "Papua"
     },
     {
       "name": "Kalimantan Utara"
     },
     function() {
         console.log('finished populating province..');
       }
   );
 });
 City.find({}).remove(function() {
   City.create({
       "id": "1",
       "name": "Kabupaten Aceh Barat",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "2",
       "name": "Kabupaten Aceh Barat Daya",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "3",
       "name": "Kabupaten Aceh Besar",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "4",
       "name": "Kabupaten Aceh Jaya",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "5",
       "name": "Kabupaten Aceh Selatan",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "6",
       "name": "Kabupaten Aceh Singkil",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "7",
       "name": "Kabupaten Aceh Tamiang",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "8",
       "name": "Kabupaten Aceh Tengah",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "9",
       "name": "Kabupaten Aceh Tenggara",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "10",
       "name": "Kabupaten Aceh Timur",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "11",
       "name": "Kabupaten Aceh Utara",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "12",
       "name": "Kabupaten Bener Meriah",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "13",
       "name": "Kabupaten Bireuen",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "14",
       "name": "Kabupaten Gayo Luwes",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "15",
       "name": "Kabupaten Nagan Raya",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "16",
       "name": "Kabupaten Pidie",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "17",
       "name": "Kabupaten Pidie Jaya",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "18",
       "name": "Kabupaten Simeulue",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "19",
       "name": "Kota Banda Aceh",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "20",
       "name": "Kota Langsa",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "21",
       "name": "Kota Lhokseumawe",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "22",
       "name": "Kota Sabang",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "23",
       "name": "Kota Subulussalam",
       "province": "Nanggroe Aceh Darussalam"
     },
     {
       "id": "24",
       "name": "Kabupaten Asahan",
       "province": "Sumatera Utara"
     },
     {
       "id": "25",
       "name": "Kabupaten Batubara",
       "province": "Sumatera Utara"
     },
     {
       "id": "26",
       "name": "Kabupaten Dairi",
       "province": "Sumatera Utara"
     },
     {
       "id": "27",
       "name": "Kabupaten Deli Serdang",
       "province": "Sumatera Utara"
     },
     {
       "id": "28",
       "name": "Kabupaten Humbang Hasundutan",
       "province": "Sumatera Utara"
     },
     {
       "id": "29",
       "name": "Kabupaten Karo",
       "province": "Sumatera Utara"
     },
     {
       "id": "30",
       "name": "Kabupaten Labuhan Batu",
       "province": "Sumatera Utara"
     },
     {
       "id": "31",
       "name": "Kabupaten Labuhanbatu Selatan",
       "province": "Sumatera Utara"
     },
     {
       "id": "32",
       "name": "Kabupaten Labuhanbatu Utara",
       "province": "Sumatera Utara"
     },
     {
       "id": "33",
       "name": "Kabupaten Langkat",
       "province": "Sumatera Utara"
     },
     {
       "id": "34",
       "name": "Kabupaten Mandailing Natal",
       "province": "Sumatera Utara"
     },
     {
       "id": "35",
       "name": "Kabupaten Nias",
       "province": "Sumatera Utara"
     },
     {
       "id": "36",
       "name": "Kabupaten Nias Barat",
       "province": "Sumatera Utara"
     },
     {
       "id": "37",
       "name": "Kabupaten Nias Selatan",
       "province": "Sumatera Utara"
     },
     {
       "id": "38",
       "name": "Kabupaten Nias Utara",
       "province": "Sumatera Utara"
     },
     {
       "id": "39",
       "name": "Kabupaten Padang Lawas",
       "province": "Sumatera Utara"
     },
     {
       "id": "40",
       "name": "Kabupaten Padang Lawas Utara",
       "province": "Sumatera Utara"
     },
     {
       "id": "41",
       "name": "Kabupaten Pakpak Barat",
       "province": "Sumatera Utara"
     },
     {
       "id": "42",
       "name": "Kabupaten Samosir",
       "province": "Sumatera Utara"
     },
     {
       "id": "43",
       "name": "Kabupaten Serdang Bedagai",
       "province": "Sumatera Utara"
     },
     {
       "id": "44",
       "name": "Kabupaten Simalungun",
       "province": "Sumatera Utara"
     },
     {
       "id": "45",
       "name": "Kabupaten Tapanuli Selatan",
       "province": "Sumatera Utara"
     },
     {
       "id": "46",
       "name": "Kabupaten Tapanuli Tengah",
       "province": "Sumatera Utara"
     },
     {
       "id": "47",
       "name": "Kabupaten Tapanuli Utara",
       "province": "Sumatera Utara"
     },
     {
       "id": "48",
       "name": "Kabupaten Toba Samosir",
       "province": "Sumatera Utara"
     },
     {
       "id": "49",
       "name": "Kota Binjai",
       "province": "Sumatera Utara"
     },
     {
       "id": "50",
       "name": "Kota Gunung Sitoli",
       "province": "Sumatera Utara"
     },
     {
       "id": "51",
       "name": "Kota Medan",
       "province": "Sumatera Utara"
     },
     {
       "id": "52",
       "name": "Kota Padangsidempuan",
       "province": "Sumatera Utara"
     },
     {
       "id": "53",
       "name": "Kota Pematang Siantar",
       "province": "Sumatera Utara"
     },
     {
       "id": "54",
       "name": "Kota Sibolga",
       "province": "Sumatera Utara"
     },
     {
       "id": "55",
       "name": "Kota Tanjung Balai",
       "province": "Sumatera Utara"
     },
     {
       "id": "56",
       "name": "Kota Tebing Tinggi",
       "province": "Sumatera Utara"
     },
     {
       "id": "57",
       "name": "Kabupaten Agam",
       "province": "Sumatera Barat"
     },
     {
       "id": "58",
       "name": "Kabupaten Dharmas Raya",
       "province": "Sumatera Barat"
     },
     {
       "id": "59",
       "name": "Kabupaten Kepulauan Mentawai",
       "province": "Sumatera Barat"
     },
     {
       "id": "60",
       "name": "Kabupaten Lima Puluh Kota",
       "province": "Sumatera Barat"
     },
     {
       "id": "61",
       "name": "Kabupaten Padang Pariaman",
       "province": "Sumatera Barat"
     },
     {
       "id": "62",
       "name": "Kabupaten Pasaman",
       "province": "Sumatera Barat"
     },
     {
       "id": "63",
       "name": "Kabupaten Pasaman Barat",
       "province": "Sumatera Barat"
     },
     {
       "id": "64",
       "name": "Kabupaten Pesisir Selatan",
       "province": "Sumatera Barat"
     },
     {
       "id": "65",
       "name": "Kabupaten Sijunjung",
       "province": "Sumatera Barat"
     },
     {
       "id": "66",
       "name": "Kabupaten Solok",
       "province": "Sumatera Barat"
     },
     {
       "id": "67",
       "name": "Kabupaten Solok Selatan",
       "province": "Sumatera Barat"
     },
     {
       "id": "68",
       "name": "Kabupaten Tanah Datar",
       "province": "Sumatera Barat"
     },
     {
       "id": "69",
       "name": "Kota Bukittinggi",
       "province": "Sumatera Barat"
     },
     {
       "id": "70",
       "name": "Kota Padang",
       "province": "Sumatera Barat"
     },
     {
       "id": "71",
       "name": "Kota Padang Panjang",
       "province": "Sumatera Barat"
     },
     {
       "id": "72",
       "name": "Kota Pariaman",
       "province": "Sumatera Barat"
     },
     {
       "id": "73",
       "name": "Kota Payakumbuh",
       "province": "Sumatera Barat"
     },
     {
       "id": "74",
       "name": "Kota Sawah Lunto",
       "province": "Sumatera Barat"
     },
     {
       "id": "75",
       "name": "Kota Solok",
       "province": "Sumatera Barat"
     },
     {
       "id": "76",
       "name": "Kabupaten Bengkalis",
       "province": "Riau"
     },
     {
       "id": "77",
       "name": "Kabupaten Indragiri Hilir",
       "province": "Riau"
     },
     {
       "id": "78",
       "name": "Kabupaten Indragiri Hulu",
       "province": "Riau"
     },
     {
       "id": "79",
       "name": "Kabupaten Kampar",
       "province": "Riau"
     },
     {
       "id": "80",
       "name": "Kabupaten Kuantan Singingi",
       "province": "Riau"
     },
     {
       "id": "81",
       "name": "Kabupaten Meranti",
       "province": "Riau"
     },
     {
       "id": "82",
       "name": "Kabupaten Pelalawan",
       "province": "Riau"
     },
     {
       "id": "83",
       "name": "Kabupaten Rokan Hilir",
       "province": "Riau"
     },
     {
       "id": "84",
       "name": "Kabupaten Rokan Hulu",
       "province": "Riau"
     },
     {
       "id": "85",
       "name": "Kabupaten Siak",
       "province": "Riau"
     },
     {
       "id": "86",
       "name": "Kota Dumai",
       "province": "Riau"
     },
     {
       "id": "87",
       "name": "Kota Pekanbaru",
       "province": "Riau"
     },
     {
       "id": "88",
       "name": "Kabupaten Bintan",
       "province": "Kepulauan Riau"
     },
     {
       "id": "89",
       "name": "Kabupaten Karimun",
       "province": "Kepulauan Riau"
     },
     {
       "id": "90",
       "name": "Kabupaten Kepulauan Anambas",
       "province": "Kepulauan Riau"
     },
     {
       "id": "91",
       "name": "Kabupaten Lingga",
       "province": "Kepulauan Riau"
     },
     {
       "id": "92",
       "name": "Kabupaten Natuna",
       "province": "Kepulauan Riau"
     },
     {
       "id": "93",
       "name": "Kota Batam",
       "province": "Kepulauan Riau"
     },
     {
       "id": "94",
       "name": "Kota Tanjung Pinang",
       "province": "Kepulauan Riau"
     },
     {
       "id": "95",
       "name": "Kabupaten Bangka",
       "province": "Kepulauan Bangka-Belitung"
     },
     {
       "id": "96",
       "name": "Kabupaten Bangka Barat",
       "province": "Kepulauan Bangka-Belitung"
     },
     {
       "id": "97",
       "name": "Kabupaten Bangka Selatan",
       "province": "Kepulauan Bangka-Belitung"
     },
     {
       "id": "98",
       "name": "Kabupaten Bangka Tengah",
       "province": "Kepulauan Bangka-Belitung"
     },
     {
       "id": "99",
       "name": "Kabupaten Belitung",
       "province": "Kepulauan Bangka-Belitung"
     },
     {
       "id": "100",
       "name": "Kabupaten Belitung Timur",
       "province": "Kepulauan Bangka-Belitung"
     },
     {
       "id": "101",
       "name": "Kota Pangkal Pinang",
       "province": "Kepulauan Bangka-Belitung"
     },
     {
       "id": "102",
       "name": "Kabupaten Kerinci",
       "province": "Jambi"
     },
     {
       "id": "103",
       "name": "Kabupaten Merangin",
       "province": "Jambi"
     },
     {
       "id": "104",
       "name": "Kabupaten Sarolangun",
       "province": "Jambi"
     },
     {
       "id": "105",
       "name": "Kabupaten Batang Hari",
       "province": "Jambi"
     },
     {
       "id": "106",
       "name": "Kabupaten Muaro Jambi",
       "province": "Jambi"
     },
     {
       "id": "107",
       "name": "Kabupaten Tanjung Jabung Timur",
       "province": "Jambi"
     },
     {
       "id": "108",
       "name": "Kabupaten Tanjung Jabung Barat",
       "province": "Jambi"
     },
     {
       "id": "109",
       "name": "Kabupaten Tebo",
       "province": "Jambi"
     },
     {
       "id": "110",
       "name": "Kabupaten Bungo",
       "province": "Jambi"
     },
     {
       "id": "111",
       "name": "Kota Jambi",
       "province": "Jambi"
     },
     {
       "id": "112",
       "name": "Kota Sungai Penuh",
       "province": "Jambi"
     },
     {
       "id": "113",
       "name": "Kabupaten Bengkulu Selatan",
       "province": "Bengkulu"
     },
     {
       "id": "114",
       "name": "Kabupaten Bengkulu Tengah",
       "province": "Bengkulu"
     },
     {
       "id": "115",
       "name": "Kabupaten Bengkulu Utara",
       "province": "Bengkulu"
     },
     {
       "id": "116",
       "name": "Kabupaten Kaur",
       "province": "Bengkulu"
     },
     {
       "id": "117",
       "name": "Kabupaten Kepahiang",
       "province": "Bengkulu"
     },
     {
       "id": "118",
       "name": "Kabupaten Lebong",
       "province": "Bengkulu"
     },
     {
       "id": "119",
       "name": "Kabupaten Mukomuko",
       "province": "Bengkulu"
     },
     {
       "id": "120",
       "name": "Kabupaten Rejang Lebong",
       "province": "Bengkulu"
     },
     {
       "id": "121",
       "name": "Kabupaten Seluma",
       "province": "Bengkulu"
     },
     {
       "id": "122",
       "name": "Kota Bengkulu",
       "province": "Bengkulu"
     },
     {
       "id": "123",
       "name": "Kabupaten Banyuasin",
       "province": "Sumatera Selatan"
     },
     {
       "id": "124",
       "name": "Kabupaten Empat Lawang",
       "province": "Sumatera Selatan"
     },
     {
       "id": "125",
       "name": "Kabupaten Lahat",
       "province": "Sumatera Selatan"
     },
     {
       "id": "126",
       "name": "Kabupaten Muara Enim",
       "province": "Sumatera Selatan"
     },
     {
       "id": "127",
       "name": "Kabupaten Musi Banyu Asin",
       "province": "Sumatera Selatan"
     },
     {
       "id": "128",
       "name": "Kabupaten Musi Rawas",
       "province": "Sumatera Selatan"
     },
     {
       "id": "129",
       "name": "Kabupaten Ogan Ilir",
       "province": "Sumatera Selatan"
     },
     {
       "id": "130",
       "name": "Kabupaten Ogan Komering Ilir",
       "province": "Sumatera Selatan"
     },
     {
       "id": "131",
       "name": "Kabupaten Ogan Komering Ulu",
       "province": "Sumatera Selatan"
     },
     {
       "id": "132",
       "name": "Kabupaten Ogan Komering Ulu Se",
       "province": "Sumatera Selatan"
     },
     {
       "id": "133",
       "name": "Kabupaten Ogan Komering Ulu Ti",
       "province": "Sumatera Selatan"
     },
     {
       "id": "134",
       "name": "Kota Lubuklinggau",
       "province": "Sumatera Selatan"
     },
     {
       "id": "135",
       "name": "Kota Pagar Alam",
       "province": "Sumatera Selatan"
     },
     {
       "id": "136",
       "name": "Kota Palembang",
       "province": "Sumatera Selatan"
     },
     {
       "id": "137",
       "name": "Kota Prabumulih",
       "province": "Sumatera Selatan"
     },
     {
       "id": "138",
       "name": "Kabupaten Lampung Barat",
       "province": "Lampung"
     },
     {
       "id": "139",
       "name": "Kabupaten Lampung Selatan",
       "province": "Lampung"
     },
     {
       "id": "140",
       "name": "Kabupaten Lampung Tengah",
       "province": "Lampung"
     },
     {
       "id": "141",
       "name": "Kabupaten Lampung Timur",
       "province": "Lampung"
     },
     {
       "id": "142",
       "name": "Kabupaten Lampung Utara",
       "province": "Lampung"
     },
     {
       "id": "143",
       "name": "Kabupaten Mesuji",
       "province": "Lampung"
     },
     {
       "id": "144",
       "name": "Kabupaten Pesawaran",
       "province": "Lampung"
     },
     {
       "id": "145",
       "name": "Kabupaten Pringsewu",
       "province": "Lampung"
     },
     {
       "id": "146",
       "name": "Kabupaten Tanggamus",
       "province": "Lampung"
     },
     {
       "id": "147",
       "name": "Kabupaten Tulang Bawang",
       "province": "Lampung"
     },
     {
       "id": "148",
       "name": "Kabupaten Tulang Bawang Barat",
       "province": "Lampung"
     },
     {
       "id": "149",
       "name": "Kabupaten Way Kanan",
       "province": "Lampung"
     },
     {
       "id": "150",
       "name": "Kota Bandar Lampung",
       "province": "Lampung"
     },
     {
       "id": "151",
       "name": "Kota Metro",
       "province": "Lampung"
     },
     {
       "id": "152",
       "name": "Kabupaten Lebak",
       "province": "Banten"
     },
     {
       "id": "153",
       "name": "Kabupaten Pandeglang",
       "province": "Banten"
     },
     {
       "id": "154",
       "name": "Kabupaten Serang",
       "province": "Banten"
     },
     {
       "id": "155",
       "name": "Kabupaten Tangerang",
       "province": "Banten"
     },
     {
       "id": "156",
       "name": "Kota Cilegon",
       "province": "Banten"
     },
     {
       "id": "157",
       "name": "Kota Serang",
       "province": "Banten"
     },
     {
       "id": "158",
       "name": "Kota Tangerang",
       "province": "Banten"
     },
     {
       "id": "159",
       "name": "Kota Tangerang Selatan",
       "province": "Banten"
     },
     {
       "id": "160",
       "name": "Kabupaten Adm. Kepulauan Serib",
       "province": "DKI Jakarta"
     },
     {
       "id": "161",
       "name": "Kota Jakarta Barat",
       "province": "DKI Jakarta"
     },
     {
       "id": "162",
       "name": "Kota Jakarta Pusat",
       "province": "DKI Jakarta"
     },
     {
       "id": "163",
       "name": "Kota Jakarta Selatan",
       "province": "DKI Jakarta"
     },
     {
       "id": "164",
       "name": "Kota Jakarta Timur",
       "province": "DKI Jakarta"
     },
     {
       "id": "165",
       "name": "Kota Jakarta Utara",
       "province": "DKI Jakarta"
     },
     {
       "id": "166",
       "name": "Kabupaten Bandung",
       "province": "Jawa Barat"
     },
     {
       "id": "167",
       "name": "Kabupaten Bandung Barat",
       "province": "Jawa Barat"
     },
     {
       "id": "168",
       "name": "Kabupaten Bekasi",
       "province": "Jawa Barat"
     },
     {
       "id": "169",
       "name": "Kabupaten Bogor",
       "province": "Jawa Barat"
     },
     {
       "id": "170",
       "name": "Kabupaten Ciamis",
       "province": "Jawa Barat"
     },
     {
       "id": "171",
       "name": "Kabupaten Cianjur",
       "province": "Jawa Barat"
     },
     {
       "id": "172",
       "name": "Kabupaten Cirebon",
       "province": "Jawa Barat"
     },
     {
       "id": "173",
       "name": "Kabupaten Garut",
       "province": "Jawa Barat"
     },
     {
       "id": "174",
       "name": "Kabupaten Indramayu",
       "province": "Jawa Barat"
     },
     {
       "id": "175",
       "name": "Kabupaten Karawang",
       "province": "Jawa Barat"
     },
     {
       "id": "176",
       "name": "Kabupaten Kuningan",
       "province": "Jawa Barat"
     },
     {
       "id": "177",
       "name": "Kabupaten Majalengka",
       "province": "Jawa Barat"
     },
     {
       "id": "178",
       "name": "Kabupaten Purwakarta",
       "province": "Jawa Barat"
     },
     {
       "id": "179",
       "name": "Kabupaten Subang",
       "province": "Jawa Barat"
     },
     {
       "id": "180",
       "name": "Kabupaten Sukabumi",
       "province": "Jawa Barat"
     },
     {
       "id": "181",
       "name": "Kabupaten Sumedang",
       "province": "Jawa Barat"
     },
     {
       "id": "182",
       "name": "Kabupaten Tasikmalaya",
       "province": "Jawa Barat"
     },
     {
       "id": "183",
       "name": "Kota Bandung",
       "province": "Jawa Barat"
     },
     {
       "id": "184",
       "name": "Kota Banjar",
       "province": "Jawa Barat"
     },
     {
       "id": "185",
       "name": "Kota Bekasi",
       "province": "Jawa Barat"
     },
     {
       "id": "186",
       "name": "Kota Bogor",
       "province": "Jawa Barat"
     },
     {
       "id": "187",
       "name": "Kota Cimahi",
       "province": "Jawa Barat"
     },
     {
       "id": "188",
       "name": "Kota Cirebon",
       "province": "Jawa Barat"
     },
     {
       "id": "189",
       "name": "Kota Depok",
       "province": "Jawa Barat"
     },
     {
       "id": "190",
       "name": "Kota Sukabumi",
       "province": "Jawa Barat"
     },
     {
       "id": "191",
       "name": "Kota Tasikmalaya",
       "province": "Jawa Barat"
     },
     {
       "id": "192",
       "name": "Kabupaten Banjarnegara",
       "province": "Jawa Tengah"
     },
     {
       "id": "193",
       "name": "Kabupaten Banyumas",
       "province": "Jawa Tengah"
     },
     {
       "id": "194",
       "name": "Kabupaten Batang",
       "province": "Jawa Tengah"
     },
     {
       "id": "195",
       "name": "Kabupaten Blora",
       "province": "Jawa Tengah"
     },
     {
       "id": "196",
       "name": "Kabupaten Boyolali",
       "province": "Jawa Tengah"
     },
     {
       "id": "197",
       "name": "Kabupaten Brebes",
       "province": "Jawa Tengah"
     },
     {
       "id": "198",
       "name": "Kabupaten Cilacap",
       "province": "Jawa Tengah"
     },
     {
       "id": "199",
       "name": "Kabupaten Demak",
       "province": "Jawa Tengah"
     },
     {
       "id": "200",
       "name": "Kabupaten Grobogan",
       "province": "Jawa Tengah"
     },
     {
       "id": "201",
       "name": "Kabupaten Jepara",
       "province": "Jawa Tengah"
     },
     {
       "id": "202",
       "name": "Kabupaten Karanganyar",
       "province": "Jawa Tengah"
     },
     {
       "id": "203",
       "name": "Kabupaten Kebumen",
       "province": "Jawa Tengah"
     },
     {
       "id": "204",
       "name": "Kabupaten Kendal",
       "province": "Jawa Tengah"
     },
     {
       "id": "205",
       "name": "Kabupaten Klaten",
       "province": "Jawa Tengah"
     },
     {
       "id": "206",
       "name": "Kabupaten Kota Tegal",
       "province": "Jawa Tengah"
     },
     {
       "id": "207",
       "name": "Kabupaten Kudus",
       "province": "Jawa Tengah"
     },
     {
       "id": "208",
       "name": "Kabupaten Magelang",
       "province": "Jawa Tengah"
     },
     {
       "id": "209",
       "name": "Kabupaten Pati",
       "province": "Jawa Tengah"
     },
     {
       "id": "210",
       "name": "Kabupaten Pekalongan",
       "province": "Jawa Tengah"
     },
     {
       "id": "211",
       "name": "Kabupaten Pemalang",
       "province": "Jawa Tengah"
     },
     {
       "id": "212",
       "name": "Kabupaten Purbalingga",
       "province": "Jawa Tengah"
     },
     {
       "id": "213",
       "name": "Kabupaten Purworejo",
       "province": "Jawa Tengah"
     },
     {
       "id": "214",
       "name": "Kabupaten Rembang",
       "province": "Jawa Tengah"
     },
     {
       "id": "215",
       "name": "Kabupaten Semarang",
       "province": "Jawa Tengah"
     },
     {
       "id": "216",
       "name": "Kabupaten Sragen",
       "province": "Jawa Tengah"
     },
     {
       "id": "217",
       "name": "Kabupaten Sukoharjo",
       "province": "Jawa Tengah"
     },
     {
       "id": "218",
       "name": "Kabupaten Temanggung",
       "province": "Jawa Tengah"
     },
     {
       "id": "219",
       "name": "Kabupaten Wonogiri",
       "province": "Jawa Tengah"
     },
     {
       "id": "220",
       "name": "Kabupaten Wonosobo",
       "province": "Jawa Tengah"
     },
     {
       "id": "221",
       "name": "Kota Magelang",
       "province": "Jawa Tengah"
     },
     {
       "id": "222",
       "name": "Kota Pekalongan",
       "province": "Jawa Tengah"
     },
     {
       "id": "223",
       "name": "Kota Salatiga",
       "province": "Jawa Tengah"
     },
     {
       "id": "224",
       "name": "Kota Semarang",
       "province": "Jawa Tengah"
     },
     {
       "id": "225",
       "name": "Kota Surakarta",
       "province": "Jawa Tengah"
     },
     {
       "id": "226",
       "name": "Kota Tegal",
       "province": "Jawa Tengah"
     },
     {
       "id": "227",
       "name": "Kabupaten Bantul",
       "province": "Daerah Istimewa Yogyakarta"
     },
     {
       "id": "228",
       "name": "Kabupaten Gunung Kidul",
       "province": "Daerah Istimewa Yogyakarta"
     },
     {
       "id": "229",
       "name": "Kabupaten Kulon Progo",
       "province": "Daerah Istimewa Yogyakarta"
     },
     {
       "id": "230",
       "name": "Kabupaten Sleman",
       "province": "Daerah Istimewa Yogyakarta"
     },
     {
       "id": "231",
       "name": "Kota Yogyakarta",
       "province": "Daerah Istimewa Yogyakarta"
     },
     {
       "id": "232",
       "name": "Kabupaten Bangkalan",
       "province": "Jawa Timur"
     },
     {
       "id": "233",
       "name": "Kabupaten Banyuwangi",
       "province": "Jawa Timur"
     },
     {
       "id": "234",
       "name": "Kabupaten Blitar",
       "province": "Jawa Timur"
     },
     {
       "id": "235",
       "name": "Kabupaten Bojonegoro",
       "province": "Jawa Timur"
     },
     {
       "id": "236",
       "name": "Kabupaten Bondowoso",
       "province": "Jawa Timur"
     },
     {
       "id": "237",
       "name": "Kabupaten Gresik",
       "province": "Jawa Timur"
     },
     {
       "id": "238",
       "name": "Kabupaten Jember",
       "province": "Jawa Timur"
     },
     {
       "id": "239",
       "name": "Kabupaten Jombang",
       "province": "Jawa Timur"
     },
     {
       "id": "240",
       "name": "Kabupaten Kediri",
       "province": "Jawa Timur"
     },
     {
       "id": "241",
       "name": "Kabupaten Lamongan",
       "province": "Jawa Timur"
     },
     {
       "id": "242",
       "name": "Kabupaten Lumajang",
       "province": "Jawa Timur"
     },
     {
       "id": "243",
       "name": "Kabupaten Madiun",
       "province": "Jawa Timur"
     },
     {
       "id": "244",
       "name": "Kabupaten Magetan",
       "province": "Jawa Timur"
     },
     {
       "id": "245",
       "name": "Kabupaten Malang",
       "province": "Jawa Timur"
     },
     {
       "id": "246",
       "name": "Kabupaten Mojokerto",
       "province": "Jawa Timur"
     },
     {
       "id": "247",
       "name": "Kabupaten Nganjuk",
       "province": "Jawa Timur"
     },
     {
       "id": "248",
       "name": "Kabupaten Ngawi",
       "province": "Jawa Timur"
     },
     {
       "id": "249",
       "name": "Kabupaten Pacitan",
       "province": "Jawa Timur"
     },
     {
       "id": "250",
       "name": "Kabupaten Pamekasan",
       "province": "Jawa Timur"
     },
     {
       "id": "251",
       "name": "Kabupaten Pasuruan",
       "province": "Jawa Timur"
     },
     {
       "id": "252",
       "name": "Kabupaten Ponorogo",
       "province": "Jawa Timur"
     },
     {
       "id": "253",
       "name": "Kabupaten Probolinggo",
       "province": "Jawa Timur"
     },
     {
       "id": "254",
       "name": "Kabupaten Sampang",
       "province": "Jawa Timur"
     },
     {
       "id": "255",
       "name": "Kabupaten Sidoarjo",
       "province": "Jawa Timur"
     },
     {
       "id": "256",
       "name": "Kabupaten Situbondo",
       "province": "Jawa Timur"
     },
     {
       "id": "257",
       "name": "Kabupaten Sumenep",
       "province": "Jawa Timur"
     },
     {
       "id": "258",
       "name": "Kabupaten Trenggalek",
       "province": "Jawa Timur"
     },
     {
       "id": "259",
       "name": "Kabupaten Tuban",
       "province": "Jawa Timur"
     },
     {
       "id": "260",
       "name": "Kabupaten Tulungagung",
       "province": "Jawa Timur"
     },
     {
       "id": "261",
       "name": "Kota Batu",
       "province": "Jawa Timur"
     },
     {
       "id": "262",
       "name": "Kota Blitar",
       "province": "Jawa Timur"
     },
     {
       "id": "263",
       "name": "Kota Kediri",
       "province": "Jawa Timur"
     },
     {
       "id": "264",
       "name": "Kota Madiun",
       "province": "Jawa Timur"
     },
     {
       "id": "265",
       "name": "Kota Malang",
       "province": "Jawa Timur"
     },
     {
       "id": "266",
       "name": "Kota Mojokerto",
       "province": "Jawa Timur"
     },
     {
       "id": "267",
       "name": "Kota Pasuruan",
       "province": "Jawa Timur"
     },
     {
       "id": "268",
       "name": "Kota Probolinggo",
       "province": "Jawa Timur"
     },
     {
       "id": "269",
       "name": "Kota Surabaya",
       "province": "Jawa Timur"
     },
     {
       "id": "270",
       "name": "Kabupaten Badung",
       "province": "Bali"
     },
     {
       "id": "271",
       "name": "Kabupaten Bangli",
       "province": "Bali"
     },
     {
       "id": "272",
       "name": "Kabupaten Buleleng",
       "province": "Bali"
     },
     {
       "id": "273",
       "name": "Kabupaten Gianyar",
       "province": "Bali"
     },
     {
       "id": "274",
       "name": "Kabupaten Jembrana",
       "province": "Bali"
     },
     {
       "id": "275",
       "name": "Kabupaten Karang Asem",
       "province": "Bali"
     },
     {
       "id": "276",
       "name": "Kabupaten Klungkung",
       "province": "Bali"
     },
     {
       "id": "277",
       "name": "Kabupaten Tabanan",
       "province": "Bali"
     },
     {
       "id": "278",
       "name": "Kota Denpasar",
       "province": "Bali"
     },
     {
       "id": "279",
       "name": "Kabupaten Bima",
       "province": "Nusa Tenggara Barat"
     },
     {
       "id": "280",
       "name": "Kabupaten Dompu",
       "province": "Nusa Tenggara Barat"
     },
     {
       "id": "281",
       "name": "Kabupaten Lombok Barat",
       "province": "Nusa Tenggara Barat"
     },
     {
       "id": "282",
       "name": "Kabupaten Lombok Tengah",
       "province": "Nusa Tenggara Barat"
     },
     {
       "id": "283",
       "name": "Kabupaten Lombok Timur",
       "province": "Nusa Tenggara Barat"
     },
     {
       "id": "284",
       "name": "Kabupaten Lombok Utara",
       "province": "Nusa Tenggara Barat"
     },
     {
       "id": "285",
       "name": "Kabupaten Sumbawa",
       "province": "Nusa Tenggara Barat"
     },
     {
       "id": "286",
       "name": "Kabupaten Sumbawa Barat",
       "province": "Nusa Tenggara Barat"
     },
     {
       "id": "287",
       "name": "Kota Bima",
       "province": "Nusa Tenggara Barat"
     },
     {
       "id": "288",
       "name": "Kota Mataram",
       "province": "Nusa Tenggara Barat"
     },
     {
       "id": "289",
       "name": "Kabupaten Alor",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "290",
       "name": "Kabupaten Belu",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "291",
       "name": "Kabupaten Ende",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "292",
       "name": "Kabupaten Flores Timur",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "293",
       "name": "Kabupaten Kupang",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "294",
       "name": "Kabupaten Lembata",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "295",
       "name": "Kabupaten Manggarai",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "296",
       "name": "Kabupaten Manggarai Barat",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "297",
       "name": "Kabupaten Manggarai Timur",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "298",
       "name": "Kabupaten Nagekeo",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "299",
       "name": "Kabupaten Ngada",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "300",
       "name": "Kabupaten Rote Ndao",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "301",
       "name": "Kabupaten Sabu Raijua",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "302",
       "name": "Kabupaten Sikka",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "303",
       "name": "Kabupaten Sumba Barat",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "304",
       "name": "Kabupaten Sumba Barat Daya",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "305",
       "name": "Kabupaten Sumba Tengah",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "306",
       "name": "Kabupaten Sumba Timur",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "307",
       "name": "Kabupaten Timor Tengah Selatan",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "308",
       "name": "Kabupaten Timor Tengah Utara",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "309",
       "name": "Kota Kupang",
       "province": "Nusa Tenggara Timur"
     },
     {
       "id": "310",
       "name": "Kabupaten Bengkayang",
       "province": "Kalimantan Barat"
     },
     {
       "id": "311",
       "name": "Kabupaten Kapuas Hulu",
       "province": "Kalimantan Barat"
     },
     {
       "id": "312",
       "name": "Kabupaten Kayong Utara",
       "province": "Kalimantan Barat"
     },
     {
       "id": "313",
       "name": "Kabupaten Ketapang",
       "province": "Kalimantan Barat"
     },
     {
       "id": "314",
       "name": "Kabupaten Kubu Raya",
       "province": "Kalimantan Barat"
     },
     {
       "id": "315",
       "name": "Kabupaten Landak",
       "province": "Kalimantan Barat"
     },
     {
       "id": "316",
       "name": "Kabupaten Melawi",
       "province": "Kalimantan Barat"
     },
     {
       "id": "317",
       "name": "Kabupaten Pontianak",
       "province": "Kalimantan Barat"
     },
     {
       "id": "318",
       "name": "Kabupaten Sambas",
       "province": "Kalimantan Barat"
     },
     {
       "id": "319",
       "name": "Kabupaten Sanggau",
       "province": "Kalimantan Barat"
     },
     {
       "id": "320",
       "name": "Kabupaten Sekadau",
       "province": "Kalimantan Barat"
     },
     {
       "id": "321",
       "name": "Kabupaten Sintang",
       "province": "Kalimantan Barat"
     },
     {
       "id": "322",
       "name": "Kota Pontianak",
       "province": "Kalimantan Barat"
     },
     {
       "id": "323",
       "name": "Kota Singkawang",
       "province": "Kalimantan Barat"
     },
     {
       "id": "324",
       "name": "Kabupaten Barito Selatan",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "325",
       "name": "Kabupaten Barito Timur",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "326",
       "name": "Kabupaten Barito Utara",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "327",
       "name": "Kabupaten Gunung Mas",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "328",
       "name": "Kabupaten Kapuas",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "329",
       "name": "Kabupaten Katingan",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "330",
       "name": "Kabupaten Kotawaringin Barat",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "331",
       "name": "Kabupaten Kotawaringin Timur",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "332",
       "name": "Kabupaten Lamandau",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "333",
       "name": "Kabupaten Murung Raya",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "334",
       "name": "Kabupaten Pulang Pisau",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "335",
       "name": "Kabupaten Seruyan",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "336",
       "name": "Kabupaten Sukamara",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "337",
       "name": "Kota Palangkaraya",
       "province": "Kalimantan Tengah"
     },
     {
       "id": "338",
       "name": "Kabupaten Balangan",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "339",
       "name": "Kabupaten Banjar",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "340",
       "name": "Kabupaten Barito Kuala",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "341",
       "name": "Kabupaten Hulu Sungai Selatan",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "342",
       "name": "Kabupaten Hulu Sungai Tengah",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "343",
       "name": "Kabupaten Hulu Sungai Utara",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "344",
       "name": "Kabupaten Kota Baru",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "345",
       "name": "Kabupaten Tabalong",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "346",
       "name": "Kabupaten Tanah Bumbu",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "347",
       "name": "Kabupaten Tanah Laut",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "348",
       "name": "Kabupaten Tapin",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "349",
       "name": "Kota Banjar Baru",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "350",
       "name": "Kota Banjarmasin",
       "province": "Kalimantan Selatan"
     },
     {
       "id": "351",
       "name": "Kabupaten Berau",
       "province": "Kalimantan Timur"
     },
     {
       "id": "352",
       "name": "Kabupaten Bulongan",
       "province": "Kalimantan Timur"
     },
     {
       "id": "353",
       "name": "Kabupaten Kutai Barat",
       "province": "Kalimantan Timur"
     },
     {
       "id": "354",
       "name": "Kabupaten Kutai Kartanegara",
       "province": "Kalimantan Timur"
     },
     {
       "id": "355",
       "name": "Kabupaten Kutai Timur",
       "province": "Kalimantan Timur"
     },
     {
       "id": "356",
       "name": "Kabupaten Malinau",
       "province": "Kalimantan Timur"
     },
     {
       "id": "357",
       "name": "Kabupaten Nunukan",
       "province": "Kalimantan Timur"
     },
     {
       "id": "358",
       "name": "Kabupaten Paser",
       "province": "Kalimantan Timur"
     },
     {
       "id": "359",
       "name": "Kabupaten Penajam Paser Utara",
       "province": "Kalimantan Timur"
     },
     {
       "id": "360",
       "name": "Kabupaten Tana Tidung",
       "province": "Kalimantan Timur"
     },
     {
       "id": "361",
       "name": "Kota Balikpapan",
       "province": "Kalimantan Timur"
     },
     {
       "id": "362",
       "name": "Kota Bontang",
       "province": "Kalimantan Timur"
     },
     {
       "id": "363",
       "name": "Kota Samarinda",
       "province": "Kalimantan Timur"
     },
     {
       "id": "364",
       "name": "Kota Tarakan",
       "province": "Kalimantan Timur"
     },
     {
       "id": "365",
       "name": "Kabupaten Boalemo",
       "province": "Gorontalo"
     },
     {
       "id": "366",
       "name": "Kabupaten Bone Bolango",
       "province": "Gorontalo"
     },
     {
       "id": "367",
       "name": "Kabupaten Gorontalo",
       "province": "Gorontalo"
     },
     {
       "id": "368",
       "name": "Kabupaten Gorontalo Utara",
       "province": "Gorontalo"
     },
     {
       "id": "369",
       "name": "Kabupaten Pohuwato",
       "province": "Gorontalo"
     },
     {
       "id": "370",
       "name": "Kota Gorontalo",
       "province": "Gorontalo"
     },
     {
       "id": "371",
       "name": "Kabupaten Bantaeng",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "372",
       "name": "Kabupaten Barru",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "373",
       "name": "Kabupaten Bone",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "374",
       "name": "Kabupaten Bulukumba",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "375",
       "name": "Kabupaten Enrekang",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "376",
       "name": "Kabupaten Gowa",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "377",
       "name": "Kabupaten Jeneponto",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "378",
       "name": "Kabupaten Luwu",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "379",
       "name": "Kabupaten Luwu Timur",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "380",
       "name": "Kabupaten Luwu Utara",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "381",
       "name": "Kabupaten Maros",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "382",
       "name": "Kabupaten Pangkajene Kepulauan",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "383",
       "name": "Kabupaten Pinrang",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "384",
       "name": "Kabupaten Selayar",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "385",
       "name": "Kabupaten Sidenreng Rappang",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "386",
       "name": "Kabupaten Sinjai",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "387",
       "name": "Kabupaten Soppeng",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "388",
       "name": "Kabupaten Takalar",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "389",
       "name": "Kabupaten Tana Toraja",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "390",
       "name": "Kabupaten Toraja Utara",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "391",
       "name": "Kabupaten Wajo",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "392",
       "name": "Kota Makassar",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "393",
       "name": "Kota Palopo",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "394",
       "name": "Kota Pare-pare",
       "province": "Sulawesi Selatan"
     },
     {
       "id": "395",
       "name": "Kabupaten Bombana",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "396",
       "name": "Kabupaten Buton",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "397",
       "name": "Kabupaten Buton Utara",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "398",
       "name": "Kabupaten Kolaka",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "399",
       "name": "Kabupaten Kolaka Utara",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "400",
       "name": "Kabupaten Konawe",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "401",
       "name": "Kabupaten Konawe Selatan",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "402",
       "name": "Kabupaten Konawe Utara",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "403",
       "name": "Kabupaten Muna",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "404",
       "name": "Kabupaten Wakatobi",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "405",
       "name": "Kota Bau-bau",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "406",
       "name": "Kota Kendari",
       "province": "Sulawesi Tenggara"
     },
     {
       "id": "407",
       "name": "Kabupaten Banggai",
       "province": "Sulawesi Tengah"
     },
     {
       "id": "408",
       "name": "Kabupaten Banggai Kepulauan",
       "province": "Sulawesi Tengah"
     },
     {
       "id": "409",
       "name": "Kabupaten Buol",
       "province": "Sulawesi Tengah"
     },
     {
       "id": "410",
       "name": "Kabupaten Donggala",
       "province": "Sulawesi Tengah"
     },
     {
       "id": "411",
       "name": "Kabupaten Morowali",
       "province": "Sulawesi Tengah"
     },
     {
       "id": "412",
       "name": "Kabupaten Parigi Moutong",
       "province": "Sulawesi Tengah"
     },
     {
       "id": "413",
       "name": "Kabupaten Poso",
       "province": "Sulawesi Tengah"
     },
     {
       "id": "414",
       "name": "Kabupaten Sigi",
       "province": "Sulawesi Tengah"
     },
     {
       "id": "415",
       "name": "Kabupaten Tojo Una-Una",
       "province": "Sulawesi Tengah"
     },
     {
       "id": "416",
       "name": "Kabupaten Toli Toli",
       "province": "Sulawesi Tengah"
     },
     {
       "id": "417",
       "name": "Kota Palu",
       "province": "Sulawesi Tengah"
     },
     {
       "id": "418",
       "name": "Kabupaten Bolaang Mangondow",
       "province": "Sulawesi Utara"
     },
     {
       "id": "419",
       "name": "Kabupaten Bolaang Mangondow Se",
       "province": "Sulawesi Utara"
     },
     {
       "id": "420",
       "name": "Kabupaten Bolaang Mangondow Ti",
       "province": "Sulawesi Utara"
     },
     {
       "id": "421",
       "name": "Kabupaten Bolaang Mangondow Ut",
       "province": "Sulawesi Utara"
     },
     {
       "id": "422",
       "name": "Kabupaten Kepulauan Sangihe",
       "province": "Sulawesi Utara"
     },
     {
       "id": "423",
       "name": "Kabupaten Kepulauan Siau Tagul",
       "province": "Sulawesi Utara"
     },
     {
       "id": "424",
       "name": "Kabupaten Kepulauan Talaud",
       "province": "Sulawesi Utara"
     },
     {
       "id": "425",
       "name": "Kabupaten Minahasa",
       "province": "Sulawesi Utara"
     },
     {
       "id": "426",
       "name": "Kabupaten Minahasa Selatan",
       "province": "Sulawesi Utara"
     },
     {
       "id": "427",
       "name": "Kabupaten Minahasa Tenggara",
       "province": "Sulawesi Utara"
     },
     {
       "id": "428",
       "name": "Kabupaten Minahasa Utara",
       "province": "Sulawesi Utara"
     },
     {
       "id": "429",
       "name": "Kota Bitung",
       "province": "Sulawesi Utara"
     },
     {
       "id": "430",
       "name": "Kota Kotamobagu",
       "province": "Sulawesi Utara"
     },
     {
       "id": "431",
       "name": "Kota Manado",
       "province": "Sulawesi Utara"
     },
     {
       "id": "432",
       "name": "Kota Tomohon",
       "province": "Sulawesi Utara"
     },
     {
       "id": "433",
       "name": "Kabupaten Majene",
       "province": "Sulawesi Barat"
     },
     {
       "id": "434",
       "name": "Kabupaten Mamasa",
       "province": "Sulawesi Barat"
     },
     {
       "id": "435",
       "name": "Kabupaten Mamuju",
       "province": "Sulawesi Barat"
     },
     {
       "id": "436",
       "name": "Kabupaten Mamuju Utara",
       "province": "Sulawesi Barat"
     },
     {
       "id": "437",
       "name": "Kabupaten Polewali Mandar",
       "province": "Sulawesi Barat"
     },
     {
       "id": "438",
       "name": "Kabupaten Buru",
       "province": "Maluku"
     },
     {
       "id": "439",
       "name": "Kabupaten Buru Selatan",
       "province": "Maluku"
     },
     {
       "id": "440",
       "name": "Kabupaten Kepulauan Aru",
       "province": "Maluku"
     },
     {
       "id": "441",
       "name": "Kabupaten Maluku Barat Daya",
       "province": "Maluku"
     },
     {
       "id": "442",
       "name": "Kabupaten Maluku Tengah",
       "province": "Maluku"
     },
     {
       "id": "443",
       "name": "Kabupaten Maluku Tenggara",
       "province": "Maluku"
     },
     {
       "id": "444",
       "name": "Kabupaten Maluku Tenggara Bara",
       "province": "Maluku"
     },
     {
       "id": "445",
       "name": "Kabupaten Seram Bagian Barat",
       "province": "Maluku"
     },
     {
       "id": "446",
       "name": "Kabupaten Seram Bagian Timur",
       "province": "Maluku"
     },
     {
       "id": "447",
       "name": "Kota Ambon",
       "province": "Maluku"
     },
     {
       "id": "448",
       "name": "Kota Tual",
       "province": "Maluku"
     },
     {
       "id": "449",
       "name": "Kabupaten Halmahera Barat",
       "province": "Maluku Utara"
     },
     {
       "id": "450",
       "name": "Kabupaten Halmahera Selatan",
       "province": "Maluku Utara"
     },
     {
       "id": "451",
       "name": "Kabupaten Halmahera Tengah",
       "province": "Maluku Utara"
     },
     {
       "id": "452",
       "name": "Kabupaten Halmahera Timur",
       "province": "Maluku Utara"
     },
     {
       "id": "453",
       "name": "Kabupaten Halmahera Utara",
       "province": "Maluku Utara"
     },
     {
       "id": "454",
       "name": "Kabupaten Kepulauan Sula",
       "province": "Maluku Utara"
     },
     {
       "id": "455",
       "name": "Kabupaten Pulau Morotai",
       "province": "Maluku Utara"
     },
     {
       "id": "456",
       "name": "Kota Ternate",
       "province": "Maluku Utara"
     },
     {
       "id": "457",
       "name": "Kota Tidore Kepulauan",
       "province": "Maluku Utara"
     },
     {
       "id": "458",
       "name": "Kabupaten Fakfak",
       "province": "Papua Barat"
     },
     {
       "id": "459",
       "name": "Kabupaten Kaimana",
       "province": "Papua Barat"
     },
     {
       "id": "460",
       "name": "Kabupaten Manokwari",
       "province": "Papua Barat"
     },
     {
       "id": "461",
       "name": "Kabupaten Maybrat",
       "province": "Papua Barat"
     },
     {
       "id": "462",
       "name": "Kabupaten Raja Ampat",
       "province": "Papua Barat"
     },
     {
       "id": "463",
       "name": "Kabupaten Sorong",
       "province": "Papua Barat"
     },
     {
       "id": "464",
       "name": "Kabupaten Sorong Selatan",
       "province": "Papua Barat"
     },
     {
       "id": "465",
       "name": "Kabupaten Tambrauw",
       "province": "Papua Barat"
     },
     {
       "id": "466",
       "name": "Kabupaten Teluk Bintuni",
       "province": "Papua Barat"
     },
     {
       "id": "467",
       "name": "Kabupaten Teluk Wondama",
       "province": "Papua Barat"
     },
     {
       "id": "468",
       "name": "Kota Sorong",
       "province": "Papua Barat"
     },
     {
       "id": "469",
       "name": "Kabupaten Merauke",
       "province": "Papua"
     },
     {
       "id": "470",
       "name": "Kabupaten Jayawijaya",
       "province": "Papua"
     },
     {
       "id": "471",
       "name": "Kabupaten Nabire",
       "province": "Papua"
     },
     {
       "id": "472",
       "name": "Kabupaten Kepulauan Yapen",
       "province": "Papua"
     },
     {
       "id": "473",
       "name": "Kabupaten Biak Numfor",
       "province": "Papua"
     },
     {
       "id": "474",
       "name": "Kabupaten Paniai",
       "province": "Papua"
     },
     {
       "id": "475",
       "name": "Kabupaten Puncak Jaya",
       "province": "Papua"
     },
     {
       "id": "476",
       "name": "Kabupaten Mimika",
       "province": "Papua"
     },
     {
       "id": "477",
       "name": "Kabupaten Boven Digoel",
       "province": "Papua"
     },
     {
       "id": "478",
       "name": "Kabupaten Mappi",
       "province": "Papua"
     },
     {
       "id": "479",
       "name": "Kabupaten Asmat",
       "province": "Papua"
     },
     {
       "id": "480",
       "name": "Kabupaten Yahukimo",
       "province": "Papua"
     },
     {
       "id": "481",
       "name": "Kabupaten Pegunungan Bintang",
       "province": "Papua"
     },
     {
       "id": "482",
       "name": "Kabupaten Tolikara",
       "province": "Papua"
     },
     {
       "id": "483",
       "name": "Kabupaten Sarmi",
       "province": "Papua"
     },
     {
       "id": "484",
       "name": "Kabupaten Keerom",
       "province": "Papua"
     },
     {
       "id": "485",
       "name": "Kabupaten Waropen",
       "province": "Papua"
     },
     {
       "id": "486",
       "name": "Kabupaten Jayapura",
       "province": "Papua"
     },
     {
       "id": "487",
       "name": "Kabupaten Deiyai",
       "province": "Papua"
     },
     {
       "id": "488",
       "name": "Kabupaten Dogiyai",
       "province": "Papua"
     },
     {
       "id": "489",
       "name": "Kabupaten Intan Jaya",
       "province": "Papua"
     },
     {
       "id": "490",
       "name": "Kabupaten Lanny Jaya",
       "province": "Papua"
     },
     {
       "id": "491",
       "name": "Kabupaten Mamberamo Raya",
       "province": "Papua"
     },
     {
       "id": "492",
       "name": "Kabupaten Mamberamo Tengah",
       "province": "Papua"
     },
     {
       "id": "493",
       "name": "Kabupaten Nduga",
       "province": "Papua"
     },
     {
       "id": "494",
       "name": "Kabupaten Puncak",
       "province": "Papua"
     },
     {
       "id": "495",
       "name": "Kabupaten Supiori",
       "province": "Papua"
     },
     {
       "id": "496",
       "name": "Kabupaten Yalimo",
       "province": "Papua"
     },
     {
       "id": "497",
       "name": "Kota Jayapura",
       "province": "Papua"
     },
     {
       "id": "498",
       "name": "Kabupaten Bulungan",
       "province": "Kalimantan Utara"
     },
     {
       "id": "499",
       "name": "Kabupaten Malinau",
       "province": "Kalimantan Utara"
     },
     {
       "id": "500",
       "name": "Kabupaten Nunukan",
       "province": "Kalimantan Utara"
     },
     {
       "id": "501",
       "name": "Kabupaten Tana Tidung",
       "province": "Kalimantan Utara"
     },
     {
       "id": "502",
       "name": "Kota Tarakan",
       "province": "Kalimantan Utara"
     },
     function() {
         console.log('finished populating city..');
       }
   );
 });
