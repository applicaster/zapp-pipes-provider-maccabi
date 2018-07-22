export const test = {
  testCommand: 'maccabi://fetchData?type=players',
  requestMocks: [{
    host: 'http://maccabi.co.il',
    method: 'GET',
    path: 'MaccabiServices/MaccabiServices.asmx/GetPlayers',
    expectedResponse: [{
      id: "Players",
      title: "סגל שחקנים",
      type: {
        value: "feed"
      },
      entry: [{
        "type": {
          "value": "link"
        },
        "id": "922",
        "title": "ג'רמי פארגו",
        "summary": "<p align=\"right\">\r\n\tהגארד שמגיע לקדנציה שלישית במועדון, שיחק לראשונה במכבי בעונת 2010/11. האמריקני חזר לתל אביב בעונת 2014/15.<br />\r\n\t<br />\r\n\tבעונה הנוכחית (מדצמבר עד פברואר) שיחק בנאנג'ינג מהליגה הסינית, במדיה העמיד ממוצעים של&nbsp; 22.8 נקודות ו-6.2 אסיסטים למשחק. בין ה-18 בפברואר ועד ה-18 במרץ שיחק בסנטה קרוז ווריורס מליגת הפיתוח האמריקנית, בשורותיה קלע 18.5 נק' ומסר 11 אסיסטים בממוצע ב-10 משחקים בהם שותף. לאחר מכן עבר לליגה הלבנונית, שם ב-5 משחקים סיפק 15.8 נק' ו-7 אסיסטים לערב.<br />\r\n\t<br />\r\n\tג'רמי פארגו מחזיק בשתי אליפויות בישראל, האחת במדי גלבוע/גליל (2010) והשניה עם מכבי תל אביב בעונה שלאחר מכן (2011). הגארד זכה עם מכבי בשני גביעי מדינה והגיע עם הצהובים תחת דייויד בלאט עד לגמר היורוליג שנערך בברצלונה ב-2011. בגמר בו ניצחה פנאתינייקוס שיחק פארגו 40 דקות, קלע 12 נקודות וחילק 9 אסיסטים. באותה עונה הוא גם נבחר לחמישיה השניה של העונה ביורוליג.<br />\r\n\t<br />\r\n\tפארגו החל את הקריירה הבוגרת שלו במדים מכללת גונזאגה וב-2009 הפך למקצוען. במהלך השנים שיחק בין היתר גם בממפיס, קליבלנד ופילדלפיה מה-NBA, צסק\"א מוסקבה, ונציה (איטליה) וכאמור גלבוע/גליל וכמובן מכבי תל אביב.</p>\r\n",
        "author": {
          "name": "ג'רמי פארגו"
        },
        "link": {
          "href": "http://www.maccabi.co.il/player.asp?PlayerID=922",
          "type": "link"
        },
        "media_group": [{
          "type": "image",
          "media_item": [{
            "src": "http://www.maccabi.co.il/images/pic_player_shadow.jpg",
            "key": "image_base",
            "type": "image"
          }]
        }]
      }]
    }]
  }]
};