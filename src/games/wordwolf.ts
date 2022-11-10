import { ExtensionClient } from "@src/types/index.js";
import {
  MinigameBase,
  MinigameConstructor,
  MinigameData,
} from "@src/types/minigame.js";
import { random } from "@src/util/index.js";
import {
  ActionRowBuilder,
  EmbedBuilder,
  GuildMember,
  GuildMemberManager,
  MessageActionRowComponentBuilder,
  MessageComponentInteraction,
  SelectMenuBuilder,
} from "discord.js";

export const minigame: MinigameConstructor = class wordwolf extends MinigameBase {
  static gameData = {
    name: "wordwolf",
    description: "ワードウルフ",
    details: `渡されたお題について話し合いをし、投票で追放する人を決めます。
だれが人狼かどうか考えましょう。
人狼が追放された場合市民の勝利で、市民が追放された場合は人狼の勝利です。`,
    maxMember: 20,
    minMember: 2,
    joinInMidway: false,
  };
  voteData: Record<string, string[]> = {};
  selfTheme: string[] = [];
  theme = [
    ["冬休み", "春休み"],
    ["副業", "アルバイト"],
    ["風呂掃除", "食器洗い"],
    ["twitter", "Line"],
    ["水族館", "動物園"],
    ["ドラえもん", "ドラミちゃん"],
    ["ファミレス", "カフェ"],
    ["アルバイト面接", "就活"],
    ["お年玉", "誕生日プレゼント"],
    ["ガラケー", "固定電話"],
    ["太陽", "月"],
    ["マフラー", "手袋"],
    ["エレベーター", "エスカレーター"],
    ["コンビニ", "スーパー"],
    ["海", "プール"],
    ["年末", "年始"],
    ["コンタクトレンズ", "メガネ"],
    ["セロテープ", "ガムテープ"],
    ["東京タワー", "スカイツリー"],
    ["コップ", "グラス"],
    ["カブトムシ", "クワガタ"],
    ["飛行機", "新幹線"],
    ["カレー", "シチュー"],
    ["はさみ", "カッター"],
    ["テニス", "卓球"],
    ["スケート", "スキー"],
    ["りす", "ハムスター"],
    ["ぞう", "きりん"],
    ["タクシー", "バス"],
    ["セミ", "鈴虫"],
    ["扇風機", "クーラー"],
    ["ディズニーランド", "USJ"],
    ["浮き輪", "水中メガネ"],
    ["洗濯機", "食洗機"],
    ["ブランコ", "シーソー"],
    ["水中メガネ", "浮き輪"],
    ["目玉焼き", "スクランブルエッグ"],
    ["鍋料理", "おでん"],
    ["チョコレート", "キャラメル"],
    ["コーヒー", "紅茶"],
    ["日本酒", "ウィスキー"],
    ["にんにく", "しょうが"],
    ["白菜", "キャベツ"],
    ["ゆで卵", "生卵"],
    ["かき氷", "アイスクリーム"],
    ["スイカ", "メロン"],
    ["お茶漬け", "ふりかけ"],
    ["塩", "砂糖"],
    ["りんご", "なし"],
    ["うどん", "そうめん"],
    ["Google", "Yahoo"],
    ["マクドナルド", "モスバーガー"],
    ["ロッテリア", "モスバーガー"],
    ["ガスト", "サイゼリア"],
    ["吉野家", "すきや"],
    ["docomo", "softbank"],
    ["スタバ", "ドトール"],
    ["セブンイレブン", "ファミマ"],
    ["ローソン", "ファミマ"],
    ["楽天市場", "amazon"],
    ["任天堂", "ソニー"],
    ["キリン", "アサヒ"],
    ["TOYOTA", "NISSAN"],
    ["ポッキー", "トッポ"],
    ["アンパン", "あんまん"],
    ["幼稚園", "保育園"],
    ["ボールペン", "シャープペン"],
    ["ファミチキ", "からあげくん"],
    ["青", "水色"],
    ["ポイントカード", "クレジットカード"],
    ["色鉛筆", "クレヨン"],
    ["不倫", "浮気"],
    ["トマトパスタ", "クリームパスタ"],
    ["餃子", "シューマイ"],
    ["友達", "親友"],
    ["パチンコ", "スロット"],
    ["石鹸", "ハンドソープ"],
    ["レモン", "グレープフルーツ"],
    ["スキー", "スノボー"],
    ["コカコーラ", "ペプシ"],
    ["野球", "ソフトボール"],
    ["肉まん", "ピザまん"],
    ["ポカリスエット", "アクエリアス"],
    ["片思い", "失恋"],
    ["ファーストキス", "初デート"],
    ["LINEで告白", "手紙で告白"],
    ["束縛系", "ストーカー"],
    ["筋肉フェチ", "手フェチ"],
    ["声フェチ", "匂いフェチ"],
    ["高収入の異性", "高身長の異性"],
    ["誠実な恋人", "優しい恋人"],
    ["好みの顔の異性", "好みの体系の異性"],
    ["金銭感覚が合う", "趣味が合う"],
    ["笑顔が素敵な異性", "ユーモアがある異性"],
    ["肉食男子", "草食男子"],
    ["水族館デート", "動物園デート"],
    ["カラオケデート", "映画館デート"],
    ["花畑デート", "牧場デート"],
    ["浮気", "性格の不一致"],
    ["結婚", "同棲"],
    ["約束を破る恋人", "悪口を言う恋人"],
    ["煙草をたくさん吸う異性", "お酒をたくさん飲む異性"],
    ["浪費癖がある恋人", "スマホ中毒の恋人"],
    ["社内恋愛", "校内恋愛"],
    ["話しが合う異性", "ユーモアがある異性"],
    ["制服デート", "浴衣デート"],
    ["誕生日プレゼント", "サプライズプレゼント"],
    ["かわいい系", "キレイ系"],
    ["ツンデレ", "ヤンデレ"],
    ["バレーボール", "ビーチバレー"],
    ["リンゴ", "さくらんぼ"],
    ["埼玉県", "千葉県"],
    ["ベッド", "布団"],
    ["ポケモン", "妖怪ウォッチ"],
    ["浴衣", "着物"],
    ["Suica", "nanaco"],
    ["プレーステーション", "プレーステーション2"],
    ["入学式", "卒業式"],
    ["桃太郎", "金太郎"],
    ["ハロウィン", "コスプレ"],
    ["やぎ", "ひつじ"],
    ["注射", "採血"],
    ["人狼", "ワードウルフ"],
    ["アイスクリーム", "ソフトクリーム"],
    ["パンケーキ", "ホットケーキ"],
    ["ショッピングモール", "商店街"],
    ["加湿器", "エアコン"],
    ["スマートスピーカー", "タブレット端末"],
    ["テレホンカード", "図書カード"],
    ["健康診断", "予防接種"],
    ["エコバッグ", "マスク"],
    ["公園", "遊園地"],
    ["昼寝", "夜更かし"],
    ["寝坊", "忘れ物"],
    ["出前", "再配達"],
    ["常備薬", "サプリメント"],
    ["金魚", "カメ"],
    ["図書館", "古本屋"],
    ["同窓会", "結婚式"],
    ["蝶ネクタイ", "リボン"],
    ["体温計", "体重計"],
    ["財布", "電子マネー"],
    ["天気予報", "星座占い"],
    ["推理小説", "謎解きゲーム"],
    ["充電ケーブル", "延長コード"],
    ["スニーカー", "革靴"],
    ["枕", "クッション"],
    ["とっくり", "升酒"],
    ["キーホルダー", "ぬいぐるみ"],
    ["ショートカット", "黒髪"],
    ["トートバッグ", "リュックサック"],
    ["ガムテープ", "接着剤"],
    ["ウノ", "ジェンガ"],
    ["ティッシュペーパー", "トイレットペーパー"],
    ["コンビニ", "ドラッグストア"],
    ["ネックレス", "指輪"],
    ["スリッパ", "サンダル"],
    ["フィギュア", "バッジ"],
    ["運転免許証", "保険証"],
    ["トイレ", "風呂"],
    ["シーソー", "ブランコ"],
    ["あやとり", "ヨーヨー"],
    ["パチンコ", "宝くじ"],
    ["二日酔い", "風邪"],
    ["ハリウッド映画", "韓国ドラマ"],
    ["レビュー", "送料"],
    ["二次会", "誕生日会"],
    ["夢", "人生"],
    ["割り勘", "分割払い"],
    ["地球儀", "辞書"],
    ["アルコール", "タバコ"],
    ["環境問題", "格差社会"],
    ["ソロキャンプ", "一人カラオケ"],
    ["ソーシャルディスタンス", "テレワーク"],
    ["耳かき", "爪切り"],
    ["初恋", "ファーストキス"],
    ["香水", "ヘアワックス"],
    ["マッチングアプリ", "インスタグラム"],
    ["真実の愛", "本当の幸せ"],
    ["告白", "プロポーズ"],
    ["ひとめぼれ", "片思い"],
    ["第一印象", "理想の恋人像"],
    ["いたずら", "ケンカ"],
    ["ハネムーン", "お泊まりデート"],
    ["価値観", "フィーリング"],
    ["アイコンタクト", "ボディタッチ"],
    ["口説き文句", "ピロートーク"],
    ["縁結び", "合格祈願"],
    ["間接キス", "スキンシップ"],
    ["すっぴん", "本性"],
    ["心理テスト", "相性占い"],
    ["アヒル口", "作り笑顔"],
    ["サバを読む", "猫をかぶる"],
    ["三角関係", "遠距離恋愛"],
    ["ラブレター", "交換日記"],
    ["愛情", "友情"],
    ["ハートの絵文字", "笑顔の顔文字"],
    ["ウェディングドレス", "振袖"],
    ["おうちデート", "映画館デート"],
    ["筋トレ", "ランニング"],
    ["ヨガ", "ラジオ体操"],
    ["オリンピック", "ワールドカップ"],
    ["ボウリング", "ビリヤード"],
    ["一輪車", "三輪車"],
    ["センタリング", "スルーパス"],
    ["バドミントン", "卓球"],
    ["山登り", "マラソン"],
    ["スクイズ", "ダブルプレー"],
    ["ラグビー", "サッカー"],
    ["ドッジボール", "雪合戦"],
    ["フェンシング", "相撲"],
    ["重量挙げ", "ハンマー投げ"],
    ["縄跳び", "フラフープ"],
    ["トライアスロン", "SASUKE"],
    ["飛び込み（水泳）", "バンジージャンプ"],
    ["空手", "柔道"],
    ["スノーボード", "スケートボード"],
    ["カヌー", "ウィンドサーフィン"],
    ["アルティメット", "スカッシュ"],
    ["マネージャー", "監督"],
    ["キャプテン", "MVP"],
    ["テニス", "ゴルフ"],
    ["大玉転がし", "綱引き"],
    ["シャトルラン", "反復横跳び"],
    ["ユニフォーム", "ジャージ"],
    ["キャッチボール", "フリスビー"],
    ["100m走", "400mリレー"],
    ["ストレッチ", "ダンス"],
    ["手押し相撲", "腕相撲"],
    ["五目炒飯", "エビピラフ"],
    ["しゃぶしゃぶ", "すき焼き"],
    ["大福", "たい焼き"],
    ["ジンジャエール", "メロンソーダ"],
    ["たこ焼き", "お好み焼き"],
    ["わたあめ", "カルメ焼き"],
    ["するめいか", "エイヒレ"],
    ["スムージー", "青汁"],
    ["チュロス", "ワッフル"],
    ["ジンギスカン", "ホルモン焼き"],
    ["チーズハットグ", "チーズタッカルビ"],
    ["お雑煮", "年越しそば"],
    ["卵かけご飯", "納豆ご飯"],
    ["ラー油", "タバスコ"],
    ["エビフライ", "エビの天ぷら"],
    ["バーベキュー", "ビュッフェ"],
    ["わさび", "コショウ"],
    ["鍋焼きうどん", "卵雑炊"],
    ["餃子", "肉まん"],
    ["激辛チャレンジ", "大食いチャレンジ"],
    ["シャトーブリアン", "大トロ"],
    ["せんべい", "クッキー"],
    ["ドリアン", "くさや"],
    ["焼き鳥", "串カツ"],
    ["そうめん", "つけ麺"],
    ["トマトジュース", "オレンジジュース"],
    ["煮卵", "角煮"],
    ["オムライス", "ナポリタン"],
    ["とんこつラーメン", "ペペロンチーノ"],
    ["カツサンド", "タマゴサンド"],
    ["パクチー", "ブルーチーズ"],
    ["ナンプラー", "ごま油"],
    ["ポテトチップス", "ポップコーン"],
    ["お通し", "試食"],
    ["塩むすび", "きびだんご"],
    ["のど飴", "はちみつれもん"],
    ["天かす", "かつお節"],
    ["ピザ", "チヂミ"],
    ["クレープ", "ベビーカステラ"],
    ["ココア", "紅茶"],
    ["手羽先", "豚足"],
    ["ガム", "グミ"],
    ["パフェ", "パンケーキ"],
    ["唐辛子", "山椒"],
    ["ひじき", "もずく"],
    ["アボカド", "カボチャ"],
    ["ジャージャー麺", "イカ墨パスタ"],
    ["ヨーグルト", "プリン"],
    ["ローストビーフ", "ステーキ"],
    ["ラッパー", "DJ"],
    ["声優", "ウグイス嬢"],
    ["弁護士", "公認会計士"],
    ["ユーチューバー", "ゲームクリエイター"],
    ["ディレクター", "指揮者"],
    ["投資家", "ギャンブラー"],
    ["ファッションデザイナー", "アパレルショップ店員"],
    ["内閣総理大臣", "代表取締役社長"],
    ["放送作家", "カメラマン"],
    ["パティシエ", "パン職人"],
    ["陶芸家", "書道家"],
    ["コンサルタント", "評論家"],
    ["ホテルコンシェルジュ", "バスガイド"],
    ["スポーツトレーナー", "体育教師"],
    ["システムエンジニア", "イラストレーター"],
    ["巫女", "舞妓"],
    ["サーファー", "ライフセーバー"],
    ["F1レーサー", "パイロット"],
    ["メイド喫茶店員", "コスプレイヤー"],
    ["通訳", "英会話講師"],
    ["警察官", "消防士"],
    ["ベビーシッター", "助産師"],
    ["バレエダンサー", "体操選手"],
    ["外交官", "政治家"],
    ["医者", "大学教授"],
    ["漫画家", "小説家"],
    ["ラーメン屋", "蕎麦屋"],
    ["ゴルファー", "ピッチャー"],
    ["ピアニスト", "ギタリスト"],
    ["探偵", "鑑定士"],
  ];
  wolfCount: number;
  wolfUser: GuildMember[] = [];
  CitizenUser: GuildMember[] = [];
  wolfThemePos!: number;
  constructor(client: ExtensionClient, data: MinigameData) {
    super(client, data);
    this.data = data;
    this.client = client;
    this.wolfCount = +(this.data.rules?.wolfCount[0] || 1);
    if (this.data.members.length < this.wolfCount)
      this.wolfCount = this.data.members.length;
    this.start();
  }
  async start() {
    super.start();
    const arr = this.data.members.concat();
    const mIds = this.data.members.map((n) => n.id);
    this.wolfUser = Array(this.wolfCount)
      .fill(0)
      .map((n) => arr.splice(random(0, arr.length - 1), 1)[0]);
    this.CitizenUser = arr;
    this.selfTheme = this.theme[random(0, this.theme.length - 1)];
    this.wolfThemePos = random(0, 1);
    this.wolfUser.forEach((user) => {
      const disme = new EmbedBuilder().setTitle("WW  GAME")
        .setDescription(`**ワードウルフ!!!**
あなたのお題は\` ${this.selfTheme[this.wolfThemePos]} \`です`);
      user.send({ embeds: [disme] });
    });
    this.CitizenUser.forEach((user) => {
      const disme = new EmbedBuilder().setTitle("WW  GAME")
        .setDescription(`**ワードウルフ!!!**
あなたのお題は\` ${this.selfTheme[1 - this.wolfThemePos]} \`です`);
      user.send({ embeds: [disme] });
    });
    await this.data.channel.send(`話し合いをはじめてください。
制限時間は${"2:00"}です。`);
    setTimeout(async () => {
      if (this.data.isEnd) return;
      const voteC =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new SelectMenuBuilder()
            .setCustomId(`gb_ww_vote_menu` + this.data.id)
            .setPlaceholder("投票する人をえらんでください")
            .setMinValues(this.wolfCount)
            .setMaxValues(this.wolfCount)
            .addOptions(
              this.data.members.map((user, index) => ({
                value: "" + index,
                label: user.displayName || user.user.username,
              }))
            )
        );
      const filter = (interaction: MessageComponentInteraction) =>
        interaction.customId == "gb_ww_vote_menu" + this.data.id &&
        mIds.indexOf(interaction.user.id) != -1;
      const collectorB = this.data.channel.createMessageComponentCollector({
        time: 1000 * 60 * 2,
        filter,
      });
      collectorB.on("collect", (interaction) => {
        if (this.data.isEnd || !interaction.isSelectMenu()) return;
        const val = interaction.values || [];
        if (val.length <= 0) {
          interaction.reply({
            content: `エラーが発生しました。もう一度投票してください。`,
            ephemeral: true,
          });
        }
        const users = val.map((v) => this.data.members[+v]);
        interaction.reply({
          content: `${users
            .map((user) => user.displayName || user.user.username)
            .join("と")}に投票しました`,
          ephemeral: true,
        });
        this.voteData[interaction.user.id] = users.map((user) => user.id);
        if (
          [...Object.values(this.voteData)].length >= this.data.members.length
        ) {
          if (voteMsg.deletable) voteMsg.delete();
          this.end();
        }
      });
      collectorB.on("end", () => {
        if (voteMsg.deletable) voteMsg.delete();
        this.end();
      });
      const voteMsg = await this.data.channel.send({
        components: [voteC],
        content: "投票してください",
      });
    }, 1000 * 60 * 2);
  }

  end() {
    super.end();
    if (this.data.isEnd) return;
    const voteD: Record<string, number> = {};
    Object.values(this.voteData).forEach((ds) =>
      ds.forEach((d) => (voteD[d] = voteD[d] ? voteD[d] + 1 : 1))
    );
    const disme = new EmbedBuilder().setTitle("WW  GAME")
      .setDescription(`**ワードウルフ!!**
\`投票結果\`
${Object.entries(voteD)
  .map(([k, v]) => `${this.getName(this.data.channel.guild.members, k)}:${v}票`)
  .join("\n")}

\`お題\`
${this.wolfUser
  .map(
    (user) =>
      `★${user.displayName || user.user.username} : \`${
        this.selfTheme[this.wolfThemePos]
      }\``
  )
  .join("\n")}
${this.CitizenUser.map(
  (user) =>
    `${user.displayName || user.user.username} : \`${
      this.selfTheme[1 - this.wolfThemePos]
    }\``
).join("\n")}
`);
    this.data.channel.send({ embeds: [disme] });
  }

  getName(users: GuildMemberManager, userId: string) {
    const user = users.cache.get(userId);
    return user?.displayName || user?.user.username;
  }
};
