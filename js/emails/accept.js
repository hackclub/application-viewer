export const accept = (names, from) => {
    console.log(from)
    if (from == "jared@hackclub.com") {
      return (
        `Hi ${names},
  
  I just want to say that I really enjoyed reading your application, and I’m happy to share that we’re moving forward! Congratulations!
  
  I’m Jared from Hack Club HQ in Vermont, and I’ll be your point of contact at HQ. Come to me for anything from marketing advice to thinking about starting a hackathon (like [Assemble](https://assemble.hackclub.com/), which was run by [@sampoder](https://hackclub.slack.com/team/USNPNJXNX), 17, from Singapore).
  
  <img src="https://cloud-1nqzned0w-hack-club-bot.vercel.app/0pxl_20240820_214330093.mp.jpg" alt="Toast smelling Jared" width="240px" />
  
  Let’s set up a call for us to meet over Zoom. We’ll get to know each other, I’ll set you up with all of the different Hack Club resources, and we’ll talk through the next steps for your club.
  
  **Can you send me 3 times over the next week that work for a 45-minute Zoom call?** I’m online Monday - Friday and available until 8 PM Eastern / 5 PM Pacific on Monday and Tuesday, and until 4 PM Eastern / 1 PM Pacific Wednesday, Thursday and Friday.
  
  I’m so looking forward to getting to know you and supporting you as you embark on this journey. Cheers!
  
  Jared
  (p.s. I just put a package with stickers in the mail to you! DM me on Slack when you get it!)
  --
  
  **Jared Senesac**
  
  Club Operations Lead, Hack Club
  
  Hack Club Slack:[@Jared](https://hackclub.slack.com/team/U07HEH4N8UV) (join the Slack [here](https://hackclub.com/slack/))
  
  Email: [jared@hackclub.com](jared@hackclub.com)
  
  <img src="https://assets.hackclub.com/flag-standalone.png" alt="Hack Club Flag" width="100px" />
  
  Hack Club is an [open source](https://github.com/hackclub/hackclub) and [financially transparent](https://bank.hackclub.com/hq/) 501(c)(3) nonprofit.
  
  Our EIN is 81-2908499. By the students, for the students.
  [Clubs](https://hackclub.com/) • [Slack](https://hackclub.com/slack/) • [HCB](https://hackclub.com/hcb/) • [Hackathons](https://hackathons.hackclub.com/)`
      )
    } else if(from == "sahiti@hackclub.com") {
        return(
            `Hey ${names},
            
I just want to say that I really enjoyed reading your application, and I’m happy to share that we’re moving forward! Congratulations!

I’m Sahiti from Hack Club HQ (currently in Georgia), and I’ll be your point of contact at HQ. Come to me for anything from marketing advice to thinking about starting a hackathon (like [Assemble](https://assemble.hackclub.com/), which was run by [@sampoder](https://hackclub.slack.com/team/USNPNJXNX), 17, from Singapore).

<img src="https://cloud-m91g7djkn-hack-club-bot.vercel.app/0img_9182.jpg" alt="Sahiti at Hack Club HQ" width="440px" />

Let's set up a call for us to meet over Zoom. We'll get to know each other, I'll set you up with all of the different Hack Club resources, and we'll talk through the next steps for your club.

**Can you send me 3 times over the next week that work for a 45 minute Zoom call?** I’m online Wednesday and Friday after 3 PM EST and all day on weekends on most days.

I'm so looking forward to getting to know you and supporting you as you embark on this journey.

Cheers!
Sahiti

(p.s. Hack Club HQ just put a package with stickers in the mail to you! DM me on Slack when you get it!)

--

**Sahiti Dasari**

Clubs Support Team, Hack Club  
Hack Club Slack: [@sahiti](https://hackclub.slack.com/team/U03RU99SGKA) (join the Slack [here](https://hackclub.com/slack/))  
Email: [sahiti@hackclub.com](sahiti@hackclub.com)

<img src="https://assets.hackclub.com/flag-standalone.png" alt="Hack Club Flag" width="100px" />

Hack Club is an [open source](https://github.com/hackclub/hackclub) and [financially transparent](https://bank.hackclub.com/hq/) 501(c)(3) nonprofit. Our EIN is 81-2908499. By the students, for the students.

[Clubs](https://hackclub.com/) • [Slack](https://hackclub.com/slack/) • [Bank](https://hackclub.com/bank/) • [Hackathons](https://hackathons.hackclub.com/)

            
            `)
    } else if(from == "arpan@hackclub.com") {
        return(`Hey ${names},

I just want to say that I really enjoyed reading your application, and I’m happy to share that we’re moving forward! Congratulations!

I’m Arpan from Hack Club HQ (currently in India) in Vermont, and I’ll be your point of contact at HQ. Come to me for anything from marketing advice to thinking about starting a hackathon (like [Assemble](https://assemble.hackclub.com/), which was run by [@sampoder](https://hackclub.slack.com/team/USNPNJXNX), 17, from Singapore). You can even text or call me - my number is +91 8826810708.

Let's set up a call for us to meet over Zoom. We'll get to know each other, I'll set you up with all the different Hack Club resources, and we'll talk through the next steps for your club.

<img src="https://cloud-iibplai1r-hack-club-bot.vercel.app/0img_20221231_081104.jpg" alt="Arpan and Thomas @ Epoch" width="240px" />

**Can you send me 3 times over the next week that work for a 45-minute Zoom call?** I’m online Tuesday - Thursday, and available from 4PM IST to 9PM IST.

I'm so looking forward to getting to know you and supporting you as you embark on this journey.

Cheers!
Arpan

(p.s. I just put a package with stickers in the mail to you! DM me on Slack when you get it!)

--

**Arpan Pandey**

Club Operations and Engineering, Hack Club
Hack Club Slack: [@A](https://hackclub.slack.com/team/U0409FSKU82) (join the Slack [here](https://hackclub.com/slack/))
Call/Text: +91 8826810708
Email: [arpan@hackclub.com](arpan@hackclub.com)

<img src="https://assets.hackclub.com/flag-standalone.png" alt="Hack Club Flag" width="100px" />

Hack Club is an [open source](https://github.com/hackclub/hackclub) and [financially transparent](https://bank.hackclub.com/hq/) 501(c)(3) nonprofit. Our EIN is 81-2908499. By the students, for the students.

[Clubs](https://hackclub.com/) • [Slack](https://hackclub.com/slack/) • [HCB](https://hackclub.com/hcb/) • [Hackathons](https://hackathons.hackclub.com/)`)
    } else if(from == "sarah@hackclub.com") {
        return(`
Hi ${names},
  
I really enjoyed learning about you through your application and I’m happy to share that we’re moving forward! Congratulations and welcome to Hack Club!
  
I’m Sarah from Hack Club HQ in Vermont, and I’ll be your point of contact at HQ. Come to me for anything from marketing advice to thinking about starting a hackathon (like [Assemble](https://assemble.hackclub.com/), which was run by [@sampoder](https://hackclub.slack.com/team/USNPNJXNX), 17, from Singapore). 

For inspiration for your club meets, I recommend checking out this video of Sahiti's Hack Club in Georgia, USA.
  <a href="https://www.youtube.com/watch?v=xXIxwV7bQTw"> <img src="https://cloud-pwc47mjn8-hack-club-bot.vercel.app/0screenshot_2024-03-21_at_10.37.40_am.png" alt="Sahiti's Hack Club" width="250px" /></a>
  
Let’s set up a call for us to meet over Zoom. We’ll get to know each other, I’ll set you up with all of the different Hack Club resources, and we’ll talk through the next steps for your club.
  
**Can you send me 3 times over the next week that work for a 45-minute Zoom call?** I’m online Monday - Friday, and available until 8 PM Eastern / 5 PM Pacific on Tuesday and Thursday, and until 4 PM Eastern / 1 PM Pacific Wednesday and Friday.
  
  I’m so looking forward to getting to know you and supporting you as you embark on this journey. Cheers!
  
  Sarah
  (p.s. I just put a package with stickers in the mail to you! DM me on Slack when you get it!)
  --
  
  **Sarah Dowden**
  
  Club Ops Lead, Hack Club
  
  Hack Club Slack:[@Sarah](https://hackclub.slack.com/team/U06L79991V0) (join the Slack [here](https://hackclub.com/slack/))
  
  Email: [sarah@hackclub.com](sarah@hackclub.com)
  
  <img src="https://assets.hackclub.com/flag-standalone.png" alt="Hack Club Flag" width="100px" />
  
  Hack Club is an [open source](https://github.com/hackclub/hackclub) and [financially transparent](https://bank.hackclub.com/hq/) 501(c)(3) nonprofit.
  
  Our EIN is 81-2908499. By the students, for the students.
  [Clubs](https://hackclub.com/) • [Slack](https://hackclub.com/slack/) • [HCB](https://hackclub.com/hcb/) • [Hackathons](https://hackathons.hackclub.com/)
        `)
    }
    
    else {
      return (
        `Hi ${names},
  
  I just want to say that I really enjoyed reading your application, and I’m happy to share that we’re moving forward! Congratulations!
  
  I’m Thomas from Hack Club HQ in Vermont, and I’ll be your point of contact at HQ. Come to me for anything from marketing advice to thinking about starting a hackathon (like [Assemble](https://assemble.hackclub.com/), which was run by [@sampoder](https://hackclub.slack.com/team/USNPNJXNX), 17, from Singapore).
  
  <img src="https://cloud-o1y7sksn6-hack-club-bot.vercel.app/0img_2271.jpg" alt="Thomas Waving" width="240px" />
  
  Let’s set up a call for us to meet over Zoom. We’ll get to know each other, I’ll set you up with all of the different Hack Club resources, and we’ll talk through the next steps for your club.
  
  **Can you send me 3 times over the next week that work for a 45-minute Zoom call?** I’m online Monday - Friday, and available until 8 PM Eastern / 5 PM Pacific on Wednesday and Thursday, and until 4 PM Eastern / 1 PM Pacific Monday, Tuesday, and Friday.
  
  I’m so looking forward to getting to know you and supporting you as you embark on this journey. Cheers!
  
  Thomas
  (p.s. I just put a package with stickers in the mail to you! DM me on Slack when you get it!)
  --
  
  **Thomas Stubblefield**
  
  Club Team, Hack Club
  
  Hack Club Slack:[@Thomas](https://hackclub.slack.com/archives/D040S0P4T6F) (join the Slack [here](https://hackclub.com/slack/))
  
  Email: [thomas@hackclub.com](thomas@hackclub.com)
  
  <img src="https://assets.hackclub.com/flag-standalone.png" alt="Hack Club Flag" width="100px" />
  
  Hack Club is an [open source](https://github.com/hackclub/hackclub) and [financially transparent](https://bank.hackclub.com/hq/) 501(c)(3) nonprofit.
  
  Our EIN is 81-2908499. By the students, for the students.
  [Clubs](https://hackclub.com/) • [Slack](https://hackclub.com/slack/) • [HCB](https://hackclub.com/hcb/) • [Hackathons](https://hackathons.hackclub.com/)`
      )
    }    
  };
  
