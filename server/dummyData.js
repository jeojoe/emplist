import _ from 'lodash';
import callApi from '../client/util/apiCaller';
import ListRequests from './models/ListRequests';
import Lists from './models/Lists';
import Companies from './models/Companies';
import Promise from 'bluebird';
import secretConfig from '../secret_config.json';

function insertDummyData() {
  const req1 = {
    company_image: 'https://pbs.twimg.com/profile_images/681491176206155776/8BbvtKpc.png',
    company_name: 'Data Wow',
    email: 'data_wow@gmail.com',
    country: 'Thailand',
    city: 'Bangkok',
    location_detail: 'Just walk down the sukhumvit street then jump 10 times.',
    password: '123456',
    remote_check: true,
    tags: ['react', 'nodejs', 'express'].map(skill => { return { text: skill }; }),
    title: 'Data Wow รับสมัคร ML Engineer/Digital Marketer [50k-130k]',
    exp_condition: 'between',
    exp_between_min: 1,
    exp_between_max: 4,
    salary_min: 50000,
    salary_max: 130000,
    details: {
      blocks: [
        {
          entityRanges: [],
          inlineStyleRanges: [],
          depth: 0,
          type: 'unstyled',
          text: 'w',
          key: '4u0d1',
        },
        {
          entityRanges: [],
          inlineStyleRanges: [],
          depth: 0,
          type: 'unstyled',
          text: '',
          key: 'c0sj1',
        },
        {
          entityRanges: [
            {
              key: 0,
              length: 1,
              offset: 0,
            },
          ],
          inlineStyleRanges: [],
          depth: 0,
          type: 'atomic',
          text: ' ',
          key: 'r7qc',
        },
        {
          entityRanges: [],
          inlineStyleRanges: [],
          depth: 0,
          type: 'unstyled',
          text: '',
          key: 'c9e2e',
        },
      ],
      entityMap: {
        0: {
          data: {
            width: '100%',
            height: 'auto',
            src: 'http://d3vi0b2svic5aq.cloudfront.net/wp_content/uploads/2016/04/08081807/header.jpg',
          },
          mutability: 'MUTABLE',
          type: 'IMAGE',
        },
      },
    },
    how_to_apply: 'อีเมล์มาที่ recruitment@iconext.co.th บอกเราว่า คุณอยากร่วมงานกับเรา',
  };

  const req2 = {
    company_image: 'http://seas100.com/wordpress/wp-content/uploads/2015/08/17Wognai1.png',
    company_name: 'Wongnai',
    email: 'wongnai@gmail.com',
    country: 'Thailand',
    city: 'Bangkok',
    location_detail: 'On the beach. just look at the horizon you will find us lol.',
    password: '123456',
    remote_check: false,
    tags: ['iOS', 'Java', 'Hadoop'].map(skill => { return { text: skill }; }),
    title: 'Wongnai เปิดรับ Dev หลายตำแหน่ง Front-End Web (React) / Node.js / Back-End Web (Java) / iOS / Android และ ฝึกงาน+สหกิจ',
    exp_condition: 'no',
    salary_min: 35000,
    salary_max: 130000,
    details: {
      blocks: [
        {
          entityRanges: [],
          inlineStyleRanges: [],
          depth: 0,
          type: 'unstyled',
          text: 'w',
          key: '4u0d1',
        },
        {
          entityRanges: [],
          inlineStyleRanges: [],
          depth: 0,
          type: 'unstyled',
          text: '',
          key: 'c0sj1',
        },
        {
          entityRanges: [
            {
              key: 0,
              length: 1,
              offset: 0,
            },
          ],
          inlineStyleRanges: [],
          depth: 0,
          type: 'atomic',
          text: ' ',
          key: 'r7qc',
        },
        {
          entityRanges: [],
          inlineStyleRanges: [],
          depth: 0,
          type: 'unstyled',
          text: '',
          key: 'c9e2e',
        },
      ],
      entityMap: {
        0: {
          data: {
            width: '100%',
            height: 'auto',
            src: 'http://d3vi0b2svic5aq.cloudfront.net/wp_content/uploads/2016/04/08081807/header.jpg',
          },
          mutability: 'MUTABLE',
          type: 'IMAGE',
        },
      },
    },
    how_to_apply: 'อีเมล์มาที่ recruitment@iconext.co.th บอกเราว่า คุณอยากร่วมงานกับเรา',
  };

  const req3 = {
    company_image: 'http://www.underconsideration.com/brandnew/archives/google_2015_logo_detail.png',
    company_name: 'FireOneOne',
    email: 'fireoneone@gmail.com',
    country: 'Thailand',
    city: 'Bangkok',
    location_detail: 'BTS onnuch, underground, behind you !!',
    password: '123456',
    remote_check: false,
    tags: ['Android'].map(skill => { return { text: skill }; }),
    title: 'FireOneOne เปิดรับสมัคร Dev(iOS, Android, Backend, Unity) และ UI/UX Designer : 1 Year',
    exp_condition: 'no',
    intern_check: true,
    salary_min: 25000,
    salary_max: 80000,
    details: {
      blocks: [
        {
          entityRanges: [],
          inlineStyleRanges: [],
          depth: 0,
          type: 'unstyled',
          text: 'w',
          key: '4u0d1',
        },
        {
          entityRanges: [],
          inlineStyleRanges: [],
          depth: 0,
          type: 'unstyled',
          text: '',
          key: 'c0sj1',
        },
        {
          entityRanges: [
            {
              key: 0,
              length: 1,
              offset: 0,
            },
          ],
          inlineStyleRanges: [],
          depth: 0,
          type: 'atomic',
          text: ' ',
          key: 'r7qc',
        },
        {
          entityRanges: [],
          inlineStyleRanges: [],
          depth: 0,
          type: 'unstyled',
          text: '',
          key: 'c9e2e',
        },
      ],
      entityMap: {
        0: {
          data: {
            width: '100%',
            height: 'auto',
            src: 'http://d3vi0b2svic5aq.cloudfront.net/wp_content/uploads/2016/04/08081807/header.jpg',
          },
          mutability: 'MUTABLE',
          type: 'IMAGE',
        },
      },
    },
    how_to_apply: 'อีเมล์มาที่ recruitment@iconext.co.th บอกเราว่า คุณอยากร่วมงานกับเรา',
  };

  const molds = [req1, req2, req3];

  const moreDummy = _.range(20).map((n) => {
    const listCopied = JSON.parse(JSON.stringify(molds[n % molds.length]));
    // *delete id, else it will be duplicated and cannot insert properly.
    delete listCopied._id;
    listCopied.title = `Copy (${n}) ${listCopied.title}`;
    return listCopied;
  });

  const allDummy = molds.concat(moreDummy);

  const pendingRequests = allDummy.map(data => {
    return callApi('/requests', 'post', { list_request: data });
  });

  // Send dummy list requests
  Promise
  .all(pendingRequests)
  .then((reqs) => {
    // if (err) {
    //   console.log('Error while sending dummy requests', err);
    //   return;
    // };
    console.log('All requests are sent: total = ', reqs.length);

    // Login first so we have token to approve listRequests
    callApi('/users/login', 'post', { username: secretConfig.admin, password: secretConfig.tempPassword })
    .then((res) => {
      const token = res.token;

      // Count total listRequests
      ListRequests.count().exec((err2, count) => {
        if (err2) {
          console.log('Count error', err2);
          return;
        }
        const randoms = _.range(10).map(() => Math.floor(Math.random() * count));
        const randomListRequests = randoms.map(rand => ListRequests.findOne().skip(rand));

        // Randomly approve listRequests
        Promise.all(randomListRequests)
        .then(resRandom => {
          const uniqRes = _.uniqBy(resRandom, '_id');
          console.log(`Will randomly approve ${uniqRes.length} list requests...`);
          const allPendingApprovals = uniqRes.map(obj => {
            return callApi(`/requests/approve/new/${obj._id}`, 'put', { password: secretConfig.tempPassword, token });
          });
          return Promise.all(allPendingApprovals);
        })
        .then(resApproval => {
          console.log(`Did randomly approve ${resApproval.length} list requests.`);
        })
        .catch(errApproval => {
          console.log('Error while randomly approve: ', errApproval);
        });
      });
    }).catch(err => {
      console.log('Error logging in as admin', err);
    });
  }).catch(err => {
    console.log('Error post request', err);
  });

  // Lists.insertMany(allDummy)
  //   .then(docs => {
  //     console.log(`  --> ${docs.length} jobs inserted.`);
  //   })
  //   .catch(err => {
  //     console.log(`  --> error: ${err}`);
  //   });
}

export default function () {
  // Remove List that doesn't connect with its company
  // console.log('  --> always removed all lists until Aunnnn change dummy data to use creating list api for connection with its company in Companies collection.');
  // Lists.remove({ company_id: '' }).then(() => {
  //   console.log('  ===');
  //   console.log('  --> removed.');
  // });
  ListRequests.count().exec((err, count) => {
    // if (count >= 23) {
    //   console.log('Dummy data: OK.');
    //   return;
    // }

    // remove all requests & Company and reinsert with API
    Promise.all([ListRequests.remove({}), Companies.remove({}), Lists.remove({})]).then(() => {
      console.log('All data removed, insert new one...');
      insertDummyData();
    })
    .catch(errFinal => {
      console.log('Error removing all data', errFinal);
    });
  });
  // Lists.count().exec((err, count) => {
  //   // 23 is the correct dummy data
  //   if (count >= 23) {
  //     console.log('Dummy data: OK.');
  //     return;
  //   }

  //   console.log('Dummy data: NOT OK, remove and reinsert all...');

  //   // not 23? re-dump
  //   // remove all data first
  //   Lists.remove({}).then(() => {
  //     console.log('  --> removed all lists');
  //     insertDummyData();
  //   });
  // });
}
