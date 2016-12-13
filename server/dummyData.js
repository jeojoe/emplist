import Lists from './models/Lists';

export default function () {
  Lists.count().exec((err, count) => {
    if (count > 0) {
      return;
    }

    const list1 = new Lists({
      company_image: 'https://pbs.twimg.com/profile_images/681491176206155776/8BbvtKpc.png',
      company_name: 'Data Wow',
      company_email: 'data_wow@gmail.com',
      company_location: {
        country: 'Thailand',
        city: 'Bangkok',
      },
      password: '123456',
      allow_remote: true,
      skills: ['react', 'nodejs', 'express'],
      title: 'Data Wow รับสมัคร ML Engineer/Digital Marketer [50k-130k]',
      exp: {
        condition: 'between',
        min: 1, max: 4,
      },
      salary: {
        min: 50000, max: 130000,
      },
      details: 'iCONEXT (อ่านว่า ไอ-โค-เน็กซ์) เป็นซอฟแวร์เฮ้าส์ลูกครึ่งไทยญี่ปุ่น ให้บริการพัฒนาและดูแลซอฟแวร์แก่องค์กรสัญชาติญี่ปุ่น ในกลุ่มอุตสาหกรรมการผลิตรถยนต์และการเงิน เราได้รับความเชื่อมั่นอย่างต่อเนื่องจากบริษัทชั้นนำของญี่ปุ่นหลายแห่งให้ดูแล งานทางด้านพัฒนาซอฟต์แวร์ให้ เรากำลังมองหาเพื่อนร่วมงานที่มีเวลาใช้คอมพิวเตอร์วันละ 8 ชั่วโมง เชี่ยวชาญทางด้านพัฒนา ซอฟแวร์ยิ่งหน้าตาดี นั่นแหละใช่เลย',
      how_to_apply: 'อีเมล์มาที่ recruitment@iconext.co.th บอกเราว่า คุณอยากร่วมงานกับเรา',
    });

    const list2 = new Lists({
      company_image: 'http://seas100.com/wordpress/wp-content/uploads/2015/08/17Wognai1.png',
      company_name: 'Wongnai',
      company_email: 'wongnai@gmail.com',
      company_location: {
        country: 'Thailand',
        city: 'Bangkok',
      },
      password: '123456',
      allow_remote: false,
      skills: ['iOS', 'Java', 'Hadoop'],
      title: 'Wongnai เปิดรับ Dev หลายตำแหน่ง Front-End Web (React) / Node.js / Back-End Web (Java) / iOS / Android และ ฝึกงาน+สหกิจ',
      exp: {
        condition: 'no',
      },
      salary: {
        min: 35000, max: 130000,
      },
      details: 'iCONEXT (อ่านว่า ไอ-โค-เน็กซ์) เป็นซอฟแวร์เฮ้าส์ลูกครึ่งไทยญี่ปุ่น ให้บริการพัฒนาและดูแลซอฟแวร์แก่องค์กรสัญชาติญี่ปุ่น ในกลุ่มอุตสาหกรรมการผลิตรถยนต์และการเงิน เราได้รับความเชื่อมั่นอย่างต่อเนื่องจากบริษัทชั้นนำของญี่ปุ่นหลายแห่งให้ดูแล งานทางด้านพัฒนาซอฟต์แวร์ให้ เรากำลังมองหาเพื่อนร่วมงานที่มีเวลาใช้คอมพิวเตอร์วันละ 8 ชั่วโมง เชี่ยวชาญทางด้านพัฒนา ซอฟแวร์ยิ่งหน้าตาดี นั่นแหละใช่เลย',
      how_to_apply: 'อีเมล์มาที่ recruitment@iconext.co.th บอกเราว่า คุณอยากร่วมงานกับเรา',
    });

    const list3 = new Lists({
      company_image: 'http://www.underconsideration.com/brandnew/archives/google_2015_logo_detail.png',
      company_name: 'FireOneOne',
      company_email: 'fireoneone@gmail.com',
      company_location: {
        country: 'Thailand',
        city: 'Bangkok',
      },
      password: '123456',
      allow_remote: false,
      skills: ['Android'],
      title: 'FireOneOne เปิดรับสมัคร Dev(iOS, Android, Backend, Unity) และ UI/UX Designer : 1 Year',
      exp: {
        condition: 'no',
        has_intern: true,
      },
      salary: {
        min: 25000, max: 80000,
      },
      details: 'iCONEXT (อ่านว่า ไอ-โค-เน็กซ์) เป็นซอฟแวร์เฮ้าส์ลูกครึ่งไทยญี่ปุ่น ให้บริการพัฒนาและดูแลซอฟแวร์แก่องค์กรสัญชาติญี่ปุ่น ในกลุ่มอุตสาหกรรมการผลิตรถยนต์และการเงิน เราได้รับความเชื่อมั่นอย่างต่อเนื่องจากบริษัทชั้นนำของญี่ปุ่นหลายแห่งให้ดูแล งานทางด้านพัฒนาซอฟต์แวร์ให้ เรากำลังมองหาเพื่อนร่วมงานที่มีเวลาใช้คอมพิวเตอร์วันละ 8 ชั่วโมง เชี่ยวชาญทางด้านพัฒนา ซอฟแวร์ยิ่งหน้าตาดี นั่นแหละใช่เลย',
      how_to_apply: 'อีเมล์มาที่ recruitment@iconext.co.th บอกเราว่า คุณอยากร่วมงานกับเรา',
    });

    Lists.create([list1, list2, list3], (error) => {
      if (!error) {
        // console.log('ready to go....');
      }
    });
  });
}
