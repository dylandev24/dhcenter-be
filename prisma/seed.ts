import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import {
  BannerPage,
  BannerStatus,
  PostStatus,
  PostVisibility,
  PrismaClient,
  PropertyCategory,
  PropertyStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

const HERO_HOME_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLtJpzP2AzZTUUwXBFs8xYgsTIPnqYool7phnN7j2kIVsmHWASzl8Tl6medAotmDJ7r5yuJOix7_xnEMQkCkfwzmOp1kusPi0ksDHNAvlZiefE1Cbw4tMwZ_DVaLz_Kw9mQbXjoyh3ZCs5MkpcpMwmmEeiP1MVSwWg2TwIi3Cy6VM5kxhGUjFzXixklb8m8oyKV78_1a-5gnMvXKLdgjU2F-JdpBqVNI5n8kPRAegB9RtrhTAjuxx3aOQSc';

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLsPEm-LthU_XVgaERocGWGICcRcgNYcSBEGTflOkSSUEnksPpL7JnqVYL81VAuIzr_iEktzRWFXqzVX4PC4VnKSFw2CQH-XH3h3NmgRCNjkUvmgYhwmV6urcW9fS_itYFWbNK0D1e6UHTln2caTMPY7FgNhRcTsGAx0l9razASNJMRagLFEHoB_v8DyF2XozSd5rR1ifTluVwgPwpdsgMi5KPmPzQx8EfT9zCk_cvgVpd8J9dcRJksGBQ';

const ZALO_ICON_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA83a4ZOTDIFSjYWSeWhtab6i3Gc_54GYIbkhd_Xp9EYqfYpjEygfp9-2sc8r0e3CXDxKL1cHzw9ddClyEdZndTkn50uk7iAb0eqtAQOJsh0QJ8Kzyntz6Zzb9RfpuNBqadCXsUIWPK7RJeHO7_m6oQwtyKAQz3tWoAGAMLab35admdmvVrPpL3sX83pBOcaJNkNBCLbk7mM7EghPiip4npvXmLRKRngCmpj7Q9Hw2Q329XD4Z9QNIpE6HYY-OjlOWj4zibirQ9U-4';

const BANNER_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDvleeneLJD-zczmkxzMmoDe9rkcyyrhLKOlIDoxT00vPD6K8eFLGglCMIQuHeF8yYXKjxsz2UxBDpxzTyIK85EQd34gbpXCgoPTb8z1kirGAdyQeFo-bzQvJmyAvt851pQAPJcZVTVpdrOtFAR1ttZNlYf97iihVOXbc2ouEgiO3k59n5cmxMBHlCgnqcQCsNUMkEQTW_CzudbLVqhGG7HXD6_rv_teQzW911L6epHt4yJ1YuWRxwQWc8Tn-sKST4E4MoqACWEhIY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA2MwVXRM07NLGJ05iRbRPcz0gXcyBOZ4hWOOfCnvLKADNiza5Hi8lSmRVGplznfGof98b9D6w14aWkzrYwugu4IVUSrPzGUioK3_Y8aQ7f7itGLuSResRXyE5bxDyHD7wmKcCiIFTMr9ezTtWwfTOZKdm9KQYUNc_Ybcftjp5oLKSPAl6WGYmHCGriVH6zBheQONBIyNdHfKjAbsHCJSiCdAXrb404KfMBFhGAmPkJo143C-WgSqbRhQM9gHj_-JXnJPcSy3uOp_E',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB9yLZOF0WqrVEXdHDYPBOYJDdjfRBaCcPrJCDWfEqNAMPxy1PudY8SU0LjxGavql_qAs5wJ3uyVBpF302vNRptLW1nM4G7rJdXsGPa8OLbtHPfctauKsV1msA6-lKTDR71bwx-_K6RCdBCUZD2eXRCSP-ex7drr_oIq2irQjrtwPGyUZq6VFSVu0hLqPG4Htov7Z678rAd3n4goDAp-p0isIjlhYN73etlLorqLu1ssEyn-KzIp4c11pIts9M7pcaY4qY-z-dQQYg',
];

const categories = [
  { name: 'Thị Trường', slug: 'thi-truong' },
  { name: 'Tin Nội Bộ', slug: 'tin-noi-bo' },
  { name: 'Phong Thủy', slug: 'phong-thuy' },
  { name: 'Dự Án Mới', slug: 'du-an-moi' },
  { name: 'Dự Án', slug: 'du-an' },
];

const newsArticles = [
  {
    slug: 'du-bao-thi-truong-2024',
    featured: true,
    title: 'Dự báo thị trường BĐS cao cấp cuối năm 2024',
    excerpt: 'Phân tích xu hướng và cơ hội đầu tư trong phân khúc premium.',
    content:
      'Thị trường bất động sản cao cấp Việt Nam tiếp tục tăng trưởng mạnh mẽ với nhu cầu từ tầng lớp trung lưu và siêu giàu...',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDbbjplSa4f6d-LdQOaWFvxxwWwciqmxjVRR7rl1360WRJQdR8xuzMsxTVSCr_NErnE_LjBgFYLrQ2IAvpo7C5ICbvaqKFe1ZYL5FoQKc7hxeTS0Z37FN2qLWWhpIixXPI0HL56dQfEAqYVBD2p4bA2dYZLIj-3XOTJ1QzZRm82tu9L1npSd1yKsxk6GyImyl8qWFCW11i4NVTLygguNbARvgFTFx_UtjDExoT9DriKkhWeTwDDV8v50qcayAgiObGZ3MP2YKa8OOo',
    category: 'Thị Trường',
    publishedAt: '2024-10-20',
    views: 1240,
  },
  {
    slug: 'dhcenter-doi-tac-nhat',
    featured: true,
    title: 'DHCENTER hợp tác đối tác Nhật Bản',
    excerpt: 'Mở rộng danh mục dự án cao cấp với đối tác quốc tế.',
    content:
      'DHCENTER chính thức ký kết hợp tác chiến lược với đối tác Nhật Bản...',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC9DK7cdY1xgJ6LWLPivs-uhs4ulHc09EB-5qGyzQd8r_3kY1XKALIrtEEl55WM9licQFRXhJKvFIUXTG0j0glzNTSoZqT1QH8BHu0JAJONUyH7O01wxQk_JHqWzsO6rxycVHTf7rkjlxBBz-_3oOU64Ej5oIIH9djIeuOiLW26aUOyAaQoohkgeQSsdO2EOgWrwcIAtYg37BOcs_baU2uyc_9NKgDG74iMxus-fMQlrc6ApKPoX1rV4tbEMEO_QvRWtYxCQ2ug5Jc',
    category: 'Dự Án',
    publishedAt: '2024-10-15',
    views: 0,
  },
  {
    slug: 'phong-thuy-nha-o',
    featured: true,
    title: 'Phong thủy nhà ở hiện đại',
    excerpt: 'Ứng dụng phong thủy trong thiết kế không gian sống đương đại.',
    content:
      'Phong thủy không chỉ là truyền thống mà còn là nghệ thuật bố trí không gian...',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7TzC9M4tiDPhDkzUYl-KO5ZSsQsUJ0AFU5O90jM8E-ypcd0jN3Iwq9AvQxrOnQmlquOxwaI5fSz8379pOvOFJqdsO1VSHlg_sFF7h2JGo_nenQKnQIqCrvRfRLGG7arzrYE9U0Nhb873eBEx9SMzWbK7ATx53-zhFXI45gCPxNErrHmeqQVUtbbfu5e1BeuEhPIryPsVSU3Las4c3wrRScs6kS2AqvRssQJqNeumaCq0UUGWk4RHLj7_rHDehGUn9cprYtbMUGA4',
    category: 'Phong Thủy',
    publishedAt: '2024-10-10',
    views: 0,
  },
  {
    slug: 'phap-ly-bds-2024',
    title: 'Cập nhật pháp lý BĐS 2024',
    excerpt: 'Những thay đổi pháp lý quan trọng ảnh hưởng thị trường.',
    content: 'Năm 2024 chứng kiến nhiều thay đổi pháp lý quan trọng...',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsPqm2YhlVDJA6QC4KNJcGEk1o2cYqzW4LdPauwQWU5g-mLhgIEVqzMscRtPnMhuSadTBTjOU3uFIiF02-zK-Dc13pqrf4f3W_Zo0cZ3wurRZ8HjSRFQ6WJUbWnyS87J7pZ7EzLgd-tok1LNc03RwESNxc4IqI1vSplXrl7BTCHyofz0lE9PYO44Mz8C0rAf2wt0oi-kVQVrhDsA4J080_shEt9lYf8VcIpsgTrpBUI1oirYaEhMzzx2WCAUC980s0f2R2vJRV3f8',
    category: 'Thị Trường',
    publishedAt: '2024-10-05',
    views: 0,
  },
  {
    slug: 'giai-thuong-phan-phoi',
    title: 'Giải thưởng phân phối xuất sắc',
    excerpt: 'DHCENTER vinh dự nhận giải thưởng phân phối BĐS xuất sắc.',
    content:
      'DHCENTER được vinh danh tại lễ trao giải phân phối bất động sản xuất sắc...',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCgnjkRM8r-ZyD_erXUQQ17r92ThrtOQmna4QWvSWiRXBPMBqTVeQsM2SwH6uvIpoWLh4aALiZagAI79M9Ee612_5MURVrGF9U02udGtnWBDyxYIZ7FPSbhtbhAgzHmzSb3zcNixTwOPYzxo5kKcwARSrDsGNM1p5ypyxlg6pI3FJrfosmo9MwSHP9FWfLckWumhe4bbfVjvDR4AkU2QLmFqe75rN69_YNhGONgLjjfHF1tTsDROmh9bF-LHtO6oBxVFu_zLq3zwAQ',
    category: 'Tin Nội Bộ',
    publishedAt: '2024-10-01',
    views: 0,
  },
  {
    slug: 'bo-tri-bep-thu-tai',
    title: 'Bố trí bếp thu tài lộc',
    excerpt: 'Bí quyết bố trí bếp theo phong thủy thu hút tài lộc.',
    content:
      'Bếp là trái tim của ngôi nhà, bố trí đúng phong thủy giúp thu hút tài lộc...',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB-IZdNKVSFHrSpHgpYMwpy7ejhGJ4gws4e6nMOdEMKk2bSHNFTbVf3LjqxfMGRx7SHFruITRU13mitjzQIMqJ0QWSfroRaPojuUsHczU4y_KczeEmtlNg1koZCjFyGAVco0Fz_q4A8k4HCKPhJYvhOHQJiaCr_tw_glommYyLNkCNIgMwUNHucXMkPs8RdnrycCVhqiqswnhPnlFW4w7ak_qGW0SpRrZfBuFAK8_3HIq4o188jYCEIUpNB-gWCC_m7cdJvE7tha4Y',
    category: 'Phong Thủy',
    publishedAt: '2024-09-28',
    views: 0,
  },
];

const properties = [
  {
    slug: 'dong-khoi-131',
    title: 'Mặt bằng Đồng Khởi 131-133',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    price: '1 Tỷ/tháng',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLuqUaGWjs8Uh9wgxqzE6IJTuPS-aKDDdEwM4ZMkJwSnr89GRujwF05v_D5Gdz_SDUIYUHOR1kN7tXaLQSHTJqudIY1VAXanmRHyK9AM1X9nzeARtL21dID7qxYOm56PgBWi71nCClh7H4Kj-wFD-iPIBenjpYBduaA-Ioz_OL5D7-WU8ON0uf8Um9JDFDo9fD9UZlwGBR_iKv-naLoqc-xBSdAVYe-xcirbBy3Tj9WjC-BoWFs_744l-4o',
    badge: 'HOT DEAL',
    views: '1.2k',
    posted: '2 năm trước',
    category: PropertyCategory.mat_bang,
  },
  {
    slug: 'hai-ba-trung-104',
    title: 'Mặt bằng Hai Bà Trưng 104',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    price: '278 Triệu/tháng',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLuTMSyzFhkuz4Y0COx0-o_I9_YVSC-7OhWFEDcNKT0Xw5RafD0Fi1D4k32QHIB_0R9TZJYot4F_rJp3_3aPHh1LVRYtBh3wvRRuNI5QgsCRRjWOqygI_go0PgW2LT9mT3L8KQ0v1L0bC1u340fSfm78mfqf_hcWq8lVQSCwmXcA_jy_6ZDRm7fIG6Sm-3PqRWX677zqIp5RdLR6t5gQjYjEdU_Ddhidud0SAGTKsLi6KqCoyD_PENNkNQ',
    views: '890',
    posted: '2 năm trước',
    category: PropertyCategory.mat_bang,
  },
  {
    slug: 'hai-ba-trung-ky-2',
    title: 'Mặt bằng Hai Bà Trưng Kỳ 2',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    price: '880 Triệu/tháng',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLuOxoQBDUVT2RxTc975DUFmezhPA74Xyu692HHEd5SiDslotHPLVwi8l_RNznf7H-MkGzT_VoX9QddxL4uXMKtErpfNXeE-klh1dKXDdQrb4FEktrJlZRLtdvJW-UGx40q_JSFmB8XQJ2DcOOg69cAZBXLfWPuY_z646d9j3zs6fRgCTCM7fCQBk9McEZCcj-MFCUDif74wT_NtSrgVqm9MRPuV67CDsTYo5ph65FwQ2Ox7YJmMH8Mlxg',
    category: PropertyCategory.mat_bang,
  },
  {
    slug: 'ba-vi-s13',
    title: 'Mặt bằng Ba Vì S13 Q.10',
    location: 'Quận 10, TP.HCM',
    district: 'Quận 10',
    price: '60 Triệu/tháng',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLuBBd_en7HiWUSRGwFdDaNziTMoJ9S1tVWKi6a4DB-62kWFgE_ZylTHPuixqdfh0hYyEqoqHiYGz0afuTTZe17gAU2NmqKs89aSU5512KXGHpRchM17VGG80k6ibYOzAmo-jprke9NxgLMlHObGrzd7EEl545dBSm2RGSYlXn2ArM6T9Bse404zhm0wmW_5PwfXCmQuzBMhgx1YxuJNzKnp8tZpgFUt-ggbsDYEzRNDlpE3KQ5jWh2XbCg',
    category: PropertyCategory.mat_bang,
  },
  {
    slug: 'cmt8-95',
    title: '95 Cách Mạng Tháng Tám',
    location: 'Quận 3, TP.HCM',
    district: 'Quận 3',
    price: '520 TỶ',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLvGJLPPvOrIl3oP44hc_pf0756pGaMhTDb9d_bYe7C0GybjX16ic6PxusYZvDC3JHJIMtKYImGS4gRT3bjJHbIdzeBX71yMx-SwPpP0FisfBhhs0qAG79z3X9QWbIYSde00Bn2Hb0LMnJST33ImGdMseSjaovD7w0LcXJ9tHhBev9T73yefvE2kh727WMEoMbM20W45mPW0WN91DQHRDYO2SnMaL78mK68mp0nIr5iJlbAM5Z307xmv9g',
    category: PropertyCategory.nha_dat,
  },
  {
    slug: 'nguyen-trai-369b',
    title: '369B Nguyễn Trãi',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    price: '450 Tỷ',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLsKU4F8w_mYy1D6WbaWJm5OvyvlAjash0VPhnygbJrhGCYCDzLvbUdGMORvfcm-nnJRJ6LqSpFuyzjPnWzi_gbvcqzFngQkDtMxQObzEKum3nozzfXiVGwE6X3YiyK4qP2-H-WhSnx1sTcEGKY2-eBTheDnexofH55UV8JcOwA8LREgF2U6-H7QSEP2Ei6hDnDS9c-DPjWtyZSGVCO2AMjQ5etZhwz85BvSNp6FHlSc5a0BReE8lTM3TvA',
    category: PropertyCategory.nha_dat,
  },
  {
    slug: 'thach-thi-thanh-21',
    title: '21-23A Thạch Thị Thanh',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    price: '57 Tỷ',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLvZYzFgB0w8s2ZX_1nUNB8Z1gw1g71MnsqNTzSA-4XTQ_Xhfh_wol9bUy_PXbF9ZAX-hnZu1OcEbMhdbRqpGdk8C2l9zel3GOM-PyTqKVlWKeEcFVFbihurGyQHCpKsBOC3JJkmb30gfaD4DASwx4hsgv0dl2g2SMWS0ZHX5BLcGAPWyIP2oQ9p5FqcEfkxdinwfklc5DtcXcyN2DH5dpQd1SpskC8NGhuLzNRKKmuHGct-GgyY7c9QQEw',
    category: PropertyCategory.nha_dat,
  },
  {
    slug: 'nguyen-dinh-chieu-33',
    title: '33 Nguyễn Đình Chiểu',
    location: 'Quận 3, TP.HCM',
    district: 'Quận 3',
    price: '850 TỶ',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLvl_MiH3jB68gNcMfm41miQLeITYL-AwHs8i0ZYbgsAqSkAzKM99eoc8whkGH9sC0zOQ9ZMvW3bYTotT4npNIexQUkpTvu3p3RlFe4u4u0L8TW0pFoRU-LtmyQhu9LK_8wYrC_E2HDBJUbViElBNCq-IAdKhKe34wfMYSPGGJPms8_gnKQc0aVJ0MK23gCz8HOn1WlvXJiI4vBTI5Bl1x8_7cKerlbfMxWkV00BGm66P4GOFbG61YqqlGQ',
    category: PropertyCategory.nha_dat,
  },
  {
    slug: 'nguyen-thi-nghia-24',
    title: '24 Nguyễn Thị Nghĩa',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    price: '3.2 Tỷ/tháng',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLuXgvKV8yGIMDO-P5SjosO_8-Cx7MUmAi8JTjfbhu8wCv1YzwXC6kr6fQ2U5f6uzu7YXBfqIgl2gE4HWaV-5_wrSoSYEgh_sDowKDgn_wtlS4QoAZ6nLEXuss0lj29Dtboq3DX2Xh5teKKpat1JyDz8OD3A-eGKnRymkwiLpBo245QdIrwiwC73Ppf8SapX7lh_gyU-f4XsAk1skE84F6q19IB9VZRjsBwx4cDoJQCfuABmw5nfL_n2RA',
    category: PropertyCategory.toa_nha,
  },
  {
    slug: 'pho-duc-chinh-53',
    title: '53-55-57 Phó Đức Chính',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    price: '1.82 Tỷ/tháng',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLsykO9yaXW4bNIHPISHd7bp9y_Ub7igSsBVahl-bZDr13H8AaOOyWdMsHA7thk5j23vD698WUKeGf66WpN7-jEpXp1ZqGUMOf4f6o01dWNYMKYxUsNV0jQmD6y3HUmF5WU_Q0ro747HEMqZKzVfiZbbDzVe7__2vJg1Ghe4a3vu3t_mYxSZVxEXVf56wjOAuJXdmnylcamfnNaEoIWWQjFUgB3LRHrGRhEaeN7eMg9TV3nPpH7dTbuofA',
    category: PropertyCategory.toa_nha,
  },
  {
    slug: 'cao-thang-93',
    title: '93 Cao Thắng',
    location: 'Quận 3, TP.HCM',
    district: 'Quận 3',
    price: '960 Triệu/tháng',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLvGXfDdqfXz7K8erFEittLXsW4iP1OuNQzDStWQ8NNVGCXSwJ9VEdm3leQzQSnkli6XR6VJ5RGrnXFPuBZsB6nLAG7d2_cSCiOKmAg4S3qcgIrB3eyvNS5F-GSFsld5caRrPdHx5D3r0_YCiO4WUnSFhBd5s3_UO4cDzXdAwl4OOanBYauo7THxNzqalv835_a1QWwIAvzmA4-1pMBF74iFXAVgStqFc7q4Xfen4Rcm06pd3UouPIDHCBc',
    category: PropertyCategory.toa_nha,
  },
  {
    slug: 'pham-ngoc-thach-32',
    title: '32 Phạm Ngọc Thạch',
    location: 'Quận 3, TP.HCM',
    district: 'Quận 3',
    price: '2.6 Tỷ/tháng',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLuaKqPfDz2oZNwtbo-vNTohxy3jFDV3FZl3BJQ6Wv-f3GOFiX7qy7eN0YNiPiIvcB92KC90x0telDBPpd50cSsWrtMZFveXKlsmPoEBs5E2GqFp4LVPWDY7tveTf5zSx6Ojmt4HAIgUhIu2q91B77lDaJF3wZ_FdYANVrT_wYJjxjSH6PeIbHOxP23SUfKYGUeUNW0LycV4ugi8uZ80US_p4dd_BOXOXRPVnouYKsz-f57LmOWy3SkhYuA',
    category: PropertyCategory.toa_nha,
  },
  {
    slug: 'deutsches-haus',
    title: 'Deutsches Haus',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    price: '107.8 Usd/m²',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLt12ayyPnDfgwCxgyNZcZpm5rQlWSnx2giuMNq9e6Y_XapatDaqoQwT_k79f50Uk6u4ZCTzD6Hh2TSXTp108pURmyS12ZhMVG7h5yGxls8hc3TttCw8UJnaAwWPmceBHHs3HLLtC8vDyT1xf-hq4IOVMEQ--dSClZKprXeMbMEAgDMVho43hJAguQOsyAcKqrBMp55o1FILhAME2M_q-MmU3w2zEMPfmxZbyVLVuHlFoUpVG4Th2jtr0C4',
    category: PropertyCategory.van_phong,
  },
  {
    slug: 'metropolitan-tower',
    title: 'Metropolitan Tower',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    price: '51.7 Usd/m²',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLvb4Ss2WzPZwxM6G0mkT0AIMvhY4xqw4yt__Y7Wr7fMPGJIuReh3WQhD5P0IpSVvp30OzMDnFRXsKA2tBAFmcbOEUuqOzO2ZqDYRLodW37MOHBTC9ENCH5VQhE1jr6DdaeLHIJhSWAtOhN9S2kmCjviHMilzjVhJuvrr--eudnPkqVR6pXI1WVSd_0M1a_yP1499TMuHkXkoq0chz5-ArI-MTBleo1bjaxi9BcDuy2VLbQZNDnSi4SNWkU',
    category: PropertyCategory.van_phong,
  },
  {
    slug: 'viettel-complex',
    title: 'Viettel Complex',
    location: 'Quận 10, TP.HCM',
    district: 'Quận 10',
    price: '54.2 Usd/m²',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLseYa4Ap8nw2kFws84g2oWEWmYKw8g7jJLgHPM3l72q-u6dysv9eZ4wIRKZ5gUSeT7hNG1aIMsrbYOZcMpVwc_7hRotoMPqLTcIlXR1J8KLI2sEC-oma3UuiUp77lPxLTyv0-P8-OIOxT0COpX_CVIzK6e7Rby-O8ReyX-VeCXneXDPKIxjAuNpKbQf_5NrOZvFBzVudZg6eWsROPH5S9X_nIiEWgRhLt952Lyf89YApyQ1m9G3eQsliQ',
    category: PropertyCategory.van_phong,
  },
  {
    slug: 'yersin-building',
    title: 'Yersin Building',
    location: 'Quận 1, TP.HCM',
    district: 'Quận 1',
    price: '30.8 Usd/m²',
    image:
      'https://lh3.googleusercontent.com/aida/AP1WRLtl1Vu91jaA8MOG8ktpE1O8OQIoUwjZKLcQ1LIqaKFAASt_gj85AIiBCNAzW0UGDDij_k6HPbM0e92JGlbQbpu-8IRQNCUglWNpEN7k9hARd_-RtGlpZFEP-AJil4oQPuxJCaIw60YfeqYdftqSb8sbC65HyaxjmCLjUQZfS9Dy3vYoeA1uJ3A2OkCXNs4KeVx1fxi5wnLTIiwU83a8-7ME9uliyxofP8yJJLKWWT01xKLJZ8OtoevH1wU',
    category: PropertyCategory.van_phong,
  },
];

const teamMembers = [
  {
    name: 'Nguyễn Văn A',
    role: 'Chủ tịch HĐQT',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKIx04l4WPtBKLPkgvooMxImVm86DRLYKL7MI4HNwqtoPKQMseNIbvKHvSzNexmhpJAAlHVDTU2-YZv2hH0fOZRxqJYalIJ1nE7z4XbJyp1dxLpHLWMCA-d_jln4NCenPMudzyQ5QJLEQuOu-sKsQRbJqj45OzHjefT7tY_Ex-jjygmkHbTqx3e4Gl6MxswaR0D3IreVVaEZuYkpY8DKrj0kDhcmbX-OsFv9RDvKTAVyUl3m1ayjsgcIi40Ml8_ayt5QCqjMB7t9E',
    sortOrder: 1,
  },
  {
    name: 'Trần Thị B',
    role: 'Tổng Giám đốc',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVb8rPtXuxTxwCGWb5QCir5-aAMXqHR8UUigbpb8DM4DfpJzam8tvcWuMrD4z2PrHeWXQsy2cmPkinkutiGEHft6jmIZ1snT39L2twyTLeLsu_rjs4zNKL4M5tg9WPjlbI9UKZZdyYsxQ4A2ouX0tAHEZvbC0Ouu05h8bZSjaQ0jKMINT_59TwHAYkusoKVnFwKbHo1PeLO9TcIm_UV9QnQJw8F9TXF88ktlfMFE05IsJeIEsWk7xKC-Gy5K3aDcQSNfAY3H4syGM',
    sortOrder: 2,
  },
  {
    name: 'Lê Văn C',
    role: 'Giám đốc Chiến lược',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuArOEeSVrWahZ5KiXF-awD-n_09HYog0WySzk7twg_AWpWy4DWuyWCjPQJhi4-eQU7zSRGZ74cAWgYSuF8aEAtdjJUhe_wyYQD-KaKsalzfI1s9IYkRngN3nSEadmWiLSj2INTAXQh_xKYqrJcVt4CPtk40QPynWvFn2xdDUtj2yrWPG39LB5gHr2W9ZtFbEsFYrijsBJkdrcEmeQgloO3_X6yakqeZ4tO59y_Jp8v4jvQ6ZfhG2BflEIrAVyW0XK-UAdovAhb3kVc',
    sortOrder: 3,
  },
];

async function main() {
  console.log('Seeding database...');

  await prisma.contactSubmission.deleteMany();
  await prisma.recruitmentApplication.deleteMany();
  await prisma.newsletterSubscription.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.post.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.property.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.siteSettings.deleteMany();

  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    const created = await prisma.category.create({ data: category });
    categoryMap.set(category.name, created.id);
  }

  for (const article of newsArticles) {
    const categoryId = categoryMap.get(article.category);
    if (!categoryId) continue;

    await prisma.post.create({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        image: article.image,
        tags: [],
        status: PostStatus.published,
        visibility: PostVisibility.public,
        featured: article.featured ?? false,
        publishedAt: new Date(article.publishedAt),
        views: article.views,
        categoryId,
      },
    });
  }

  await prisma.banner.createMany({
    data: [
      {
        title: 'Summer Luxury Collection 2024',
        image: BANNER_IMAGES[0],
        link: '/projects',
        page: BannerPage.home,
        status: BannerStatus.active,
        clicks: 420,
        createdAt: new Date('2023-10-12'),
        updatedAt: new Date('2024-10-18'),
      },
      {
        title: 'Exclusive Coastal Penthouses',
        image: BANNER_IMAGES[1],
        link: '/projects/exclusive-coastal',
        page: BannerPage.internal,
        status: BannerStatus.inactive,
        clicks: 180,
        createdAt: new Date('2023-08-05'),
        updatedAt: new Date('2024-09-05'),
      },
      {
        title: 'New Partners: Architectural Excellence',
        image: BANNER_IMAGES[2],
        link: '/news/dhcenter-doi-tac-nhat',
        page: BannerPage.news,
        status: BannerStatus.active,
        clicks: 310,
        createdAt: new Date('2023-11-15'),
        updatedAt: new Date('2024-10-20'),
      },
    ],
  });

  for (const property of properties) {
    await prisma.property.create({
      data: {
        ...property,
        status: PropertyStatus.active,
        images: [property.image],
      },
    });
  }

  await prisma.siteSettings.create({
    data: {
      id: 'default',
      siteName: 'DHCENTER',
      tagline: 'Luxury Real Estate',
      hotline: '0941 977 234',
      email: 'contact@dhcenter.com',
      emailHr: 'connectland61@gmail.com',
      address: '670-672 Đường Ba Tháng Hai, P.14, Q.10, HCM',
      officeBitexco: 'Tầng 12 Bitexco, Quận 1, TP.HCM',
      heroImage: HERO_HOME_URL,
      logoUrl: LOGO_URL,
      zaloIconUrl: ZALO_ICON_URL,
      partners: [
        'VINHOMES',
        'SUN GROUP',
        'NOVALAND',
        'MASTERISE',
        'BIM GROUP',
        'KEPPEL LAND',
      ],
    },
  });

  await prisma.teamMember.createMany({ data: teamMembers });

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@dhcenter.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123456';
  const adminName = process.env.ADMIN_NAME ?? 'Admin';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: adminName,
    },
  });

  console.log('Seed completed.');
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
