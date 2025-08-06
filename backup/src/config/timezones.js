const timezones = [
  {
    value: -12,
    label: '(-12:00) International Date Line West',
  },
  {
    value: -11,
    label: '(-11:00) Coordinated Universal Time-11',
  },
  {
    value: -10,
    label: '(-10:00) Hawaii',
  },
  {
    value: -9,
    label: '(-09:00) Alaska',
  },
  {
    value: -8,
    label: '(-08:00) Baja California',
  },
  {
    value: -8,
    label: '(-08:00) Pacific Time (US & Canada)',
  },
  {
    value: -7,
    label: '(-07:00) Arizona',
  },
  {
    value: -7,
    label: '(-07:00) Chihuahua, La Paz, Mazatlan',
  },
  {
    value: -7,
    label: '(-07:00) Mountain Time (US & Canada)',
  },
  {
    value: -6,
    label: '(-06:00) Central America',
  },
  {
    value: -6,
    label: '(-06:00) Central Time (US & Canada)',
  },
  {
    value: -6,
    label: '(-06:00) Guadalajara, Mexico City, Monterrey',
  },
  {
    value: -6,
    label: '(-06:00) Saskatchewan',
  },
  {
    value: -5,
    label: '(-05:00) Bogota, Lima, Quito',
  },
  {
    value: -5,
    label: '(-05:00) Eastern Time (US & Canada)',
  },
  {
    value: -5,
    label: '(-05:00) Indiana (East)',
  },
  {
    value: -4.5,
    label: '(-04:30) Caracas',
  },
  {
    value: -4,
    label: '(-04:00) Asuncion',
  },
  {
    value: -4,
    label: '(-04:00) Atlantic Time (Canada)',
  },
  {
    value: -4,
    label: '(-04:00) Cuiaba',
  },
  {
    value: -4,
    label: '(-04:00) Georgetown, La Paz, Manaus, San Juan',
  },
  {
    value: -4,
    label: '(-04:00) Santiago',
  },
  {
    value: -3.5,
    label: '(-03:30) Newfoundland',
  },
  {
    value: -3,
    label: '(-03:00) Brasilia',
  },
  {
    value: -3,
    label: '(-03:00) Buenos Aires',
  },
  {
    value: -3,
    label: '(-03:00) Cayenne, Fortaleza',
  },
  {
    value: -3,
    label: '(-03:00) Greenland',
  },
  {
    value: -3,
    label: '(-03:00) Montevideo',
  },
  {
    value: -3,
    label: '(-03:00) Salvador',
  },
  {
    value: -2,
    label: '(-02:00) Coordinated Universal Time-02',
  },
  {
    value: -2,
    label: '(-02:00) Mid-Atlantic - Old',
  },
  {
    value: -1,
    label: '(-01:00) Azores',
  },
  {
    value: -1,
    label: '(-01:00) Cape Verde Is.',
  },
  {
    value: 0,
    label: '(+00:00) Coordinated Universal Time',
  },
  {
    value: 0,
    label: '(+00:00) Edinburgh, London',
  },
  {
    value: 0,
    label: '(+00:00) Monrovia, Reykjavik',
  },
  {
    value: 0,
    label: '(+00:00) Dublin, Lisbon',
  },
  {
    value: 1,
    label: '(+01:00) Casablanca',
  },
  {
    value: 1,
    label: '(+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
  },
  {
    value: 1,
    label: '(+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
  },
  {
    value: 1,
    label: '(+01:00) Brussels, Copenhagen, Madrid, Paris',
  },
  {
    value: 1,
    label: '(+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
  },
  {
    value: 1,
    label: '(+01:00) West Central Africa',
  },
  {
    value: 1,
    label: '(+01:00) Windhoek',
  },
  {
    value: 2,
    label: '(+02:00) Athens, Bucharest',
  },
  {
    value: 2,
    label: '(+02:00) Beirut',
  },
  {
    value: 2,
    label: '(+02:00) Cairo',
  },
  {
    value: 2,
    label: '(+02:00) Damascus',
  },
  {
    value: 2,
    label: '(+02:00) E. Europe',
  },
  {
    value: 2,
    label: '(+02:00) Harare, Pretoria',
  },
  {
    value: 2,
    label: '(+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
  },
  {
    value: 2,
    label: '(+02:00) Jerusalem',
  },
  {
    value: 2,
    label: '(+02:00) Tripoli',
  },
  {
    value: 3,
    label: '(+03:00) Istanbul',
  },
  {
    value: 3,
    label: '(+03:00) Amman',
  },
  {
    value: 3,
    label: '(+03:00) Baghdad',
  },
  {
    value: 2,
    label: '(+02:00) Kaliningrad',
  },
  {
    value: 3,
    label: '(+03:00) Kuwait, Riyadh',
  },
  {
    value: 3,
    label: '(+03:00) Nairobi',
  },
  {
    value: 3,
    label: '(+03:00) Moscow, St. Petersburg, Volgograd, Minsk',
  },
  {
    value: 4,
    label: '(+04:00) Samara, Ulyanovsk, Saratov',
  },
  {
    value: 3.5,
    label: '(+03:30) Tehran',
  },
  {
    value: 4,
    label: '(+04:00) Abu Dhabi, Muscat',
  },
  {
    value: 4,
    label: '(+04:00) Baku',
  },
  {
    value: 4,
    label: '(+04:00) Port Louis',
  },
  {
    value: 4,
    label: '(+04:00) Tbilisi',
  },
  {
    value: 4,
    label: '(+04:00) Yerevan',
  },
  {
    value: 4.5,
    label: '(+04:30) Kabul',
  },
  {
    value: 5,
    label: '(+05:00) Ashgabat, Tashkent',
  },
  {
    value: 5,
    label: '(+05:00) Yekaterinburg',
  },
  {
    value: 5,
    label: '(+05:00) Islamabad, Karachi',
  },
  {
    value: 5.5,
    label: '(+05:30) Chennai, Kolkata, Mumbai, New Delhi',
  },
  {
    value: 5.5,
    label: '(+05:30) Sri Jayawardenepura',
  },
  {
    value: 5.75,
    label: '(+05:45) Kathmandu',
  },
  {
    value: 6,
    label: '(+06:00) Nur-Sultan (Astana)',
  },
  {
    value: 6,
    label: '(+06:00) Dhaka',
  },
  {
    value: 6.5,
    label: '(+06:30) Yangon (Rangoon)',
  },
  {
    value: 7,
    label: '(+07:00) Bangkok, Hanoi, Jakarta',
  },
  {
    value: 7,
    label: '(+07:00) Novosibirsk',
  },
  {
    value: 8,
    label: '(+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
  },
  {
    value: 8,
    label: '(+08:00) Krasnoyarsk',
  },
  {
    value: 8,
    label: '(+08:00) Kuala Lumpur, Singapore',
  },
  {
    value: 8,
    label: '(+08:00) Perth',
  },
  {
    value: 8,
    label: '(+08:00) Taipei',
  },
  {
    value: 8,
    label: '(+08:00) Ulaanbaatar',
  },
  {
    value: 8,
    label: '(+08:00) Irkutsk',
  },
  {
    value: 9,
    label: '(+09:00) Osaka, Sapporo, Tokyo',
  },
  {
    value: 9,
    label: '(+09:00) Seoul',
  },
  {
    value: 9.5,
    label: '(+09:30) Adelaide',
  },
  {
    value: 9.5,
    label: '(+09:30) Darwin',
  },
  {
    value: 10,
    label: '(+10:00) Brisbane',
  },
  {
    value: 10,
    label: '(+10:00) Canberra, Melbourne, Sydney',
  },
  {
    value: 10,
    label: '(+10:00) Guam, Port Moresby',
  },
  {
    value: 10,
    label: '(+10:00) Hobart',
  },
  {
    value: 9,
    label: '(+09:00) Yakutsk',
  },
  {
    value: 11,
    label: '(+11:00) Solomon Is., New Caledonia',
  },
  {
    value: 11,
    label: '(+11:00) Vladivostok',
  },
  {
    value: 12,
    label: '(+12:00) Auckland, Wellington',
  },
  {
    value: 12,
    label: '(+12:00) Coordinated Universal Time+12',
  },
  {
    value: 12,
    label: '(+12:00) Fiji',
  },
  {
    value: 12,
    label: '(+12:00) Magadan',
  },
  {
    value: 12,
    label: '(+12:00) Petropavlovsk-Kamchatsky - Old',
  },
  {
    value: 13,
    label: '(+13:00) Nuku\'alofa',
  },
  {
    value: 14,
    label: '(+14:00) Samoa',
  }
];

export default timezones
