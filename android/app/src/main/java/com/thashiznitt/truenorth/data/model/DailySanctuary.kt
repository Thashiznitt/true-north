package com.thashiznitt.truenorth.data.model

import kotlinx.serialization.Serializable
import java.util.Calendar

@Serializable
data class GuidedPrompt(
    val surrender: BilingualText,
    val courage: BilingualText,
    val waiting: BilingualText
)

@Serializable
data class BilingualText(
    val en: String,
    val sw: String
)

@Serializable
data class AnsweredPrayer(
    val id: String,
    val category: String, // Family, Business, Peace, Healing
    val authorName: String,
    val location: String,
    val dateText: String,
    val testimony: String,
    val scriptureRef: String,
    val prayedDays: Int
)

@Serializable
data class DailySanctuary(
    val archetype: String, // Esther, Hannah, Ruth, Deborah, Mary
    val title: BilingualText,
    val scriptureRef: String,
    val scriptureText: BilingualText,
    val affirmation: BilingualText,
    val sisterhoodAudioTitle: String,
    val sisterhoodNarrationEn: String,
    val sisterhoodNarrationSw: String,
    val audioDurationSeconds: Int = 90,
    val prompts: GuidedPrompt
) {
    companion object {
        val Deck: List<DailySanctuary> = listOf(
            DailySanctuary(
                archetype = "Esther",
                title = BilingualText(
                    en = "Queen of Courage & Divine Purpose",
                    sw = "Malkia wa Ujasiri na Kusudi Takatifu"
                ),
                scriptureRef = "Esther 4:14",
                scriptureText = BilingualText(
                    en = "And who knows but that you have come to your royal position for such a time as this?",
                    sw = "Naye ni nani ajuaye kama wewe hukuingia katika ufalme kwa ajili ya wakati kama huu?"
                ),
                affirmation = BilingualText(
                    en = "I was born for such a time as this. God has clothed me with royal courage to walk boldly in my calling.",
                    sw = "Nalizaliwa kwa ajili ya wakati kama huu. Mungu amenivika ujasiri mkuu wa kutembea kwa uaminifu."
                ),
                sisterhoodAudioTitle = "Sisterhood Voice Note • Esther's Courage",
                sisterhoodNarrationEn = "Good morning sister. When you face circumstances larger than your strength, remember Queen Esther. You were not placed in this family, this career, or this season by accident. You have come to the Kingdom for such a time as this. Take a deep breath, lift your head, and walk with the quiet dignity of a daughter of the King.",
                sisterhoodNarrationSw = "Habari ya asubuhi dada yangu. Wakati unakabiliwa na mazingira magumu, mkumbuke Malkia Esta. Hukuwekwa katika familia hii au msimu huu kwa bahati mbaya. Umeingia katika ufalme kwa ajili ya wakati kama huu. Inua kichwa chako, tembea kwa ujasiri, kwani wewe ni binti mteule wa Mfalme.",
                audioDurationSeconds = 90,
                prompts = GuidedPrompt(
                    surrender = BilingualText(
                        en = "What fear or anxiety are you ready to surrender at the Altar today?",
                        sw = "Ni hofu au wasiwasi upi uko tayari kuutua Madhabahuni leo?"
                    ),
                    courage = BilingualText(
                        en = "Where is God asking you to speak up or step forward with unwavering faith?",
                        sw = "Wapi Mungu anakuomba usimame au usonge mbele kwa imani isiyotikisika?"
                    ),
                    waiting = BilingualText(
                        en = "In what area of your life are you resting in God's perfect timing?",
                        sw = "Katika eneo gani la maisha yako unatulia katika wakati sahihi wa Mungu?"
                    )
                )
            ),
            DailySanctuary(
                archetype = "Hannah",
                title = BilingualText(
                    en = "Mother of Persistent Faith & Surrender",
                    sw = "Mwanamke wa Imani Thabiti na Kujisalimisha"
                ),
                scriptureRef = "1 Samuel 1:27",
                scriptureText = BilingualText(
                    en = "I prayed for this child, and the Lord has granted me what I asked of Him.",
                    sw = "Naliomba mtoto huyu, naye Bwana amenipa ombi langu nililomwomba."
                ),
                affirmation = BilingualText(
                    en = "My silent tears are seen by God. What I surrender to Him in prayer, He redeems in glory.",
                    sw = "Machozi yangu ya siri yanaonekana na Mungu. Ninachokisalimisha Kwake kwa maombi, anakitukuza."
                ),
                sisterhoodAudioTitle = "Sisterhood Voice Note • Hannah's Surrender",
                sisterhoodNarrationEn = "Dear sister, if your heart feels heavy with an unanswered prayer today, sit with Hannah. She poured out her soul without restraint before the Lord, and her face was no longer sad. You do not have to carry this grief alone. The Lord of Hosts remembers your devotion and hears every whispered plea.",
                sisterhoodNarrationSw = "Dada mpendwa, ikiwa moyo wako una huzuni kwa ombi ambalo halijajibiwa, kumbuka Hana. Alimimina nafsi yake mbele za Bwana, na uso wake haukuwa na huzuni tena. Huna haja ya kubeba mzigo huu peke yako. Bwana wa majeshi anakukumbuka na anasikia kila kilio chako.",
                audioDurationSeconds = 90,
                prompts = GuidedPrompt(
                    surrender = BilingualText(
                        en = "What deep desire are you handing over from your grip into God's caring hands?",
                        sw = "Ni haja ipi kuu ya moyo unayomkabidhi Mungu leo?"
                    ),
                    courage = BilingualText(
                        en = "Can you trust that God remembers you even when the answer feels delayed?",
                        sw = "Je, unaamini kwamba Mungu hakusahau hata wakati jibu linapochelewa?"
                    ),
                    waiting = BilingualText(
                        en = "How can you worship in the waiting room of faith today?",
                        sw = "Unawezaje kumsifu Mungu katika chumba cha kusubiri leo?"
                    )
                )
            ),
            DailySanctuary(
                archetype = "Ruth",
                title = BilingualText(
                    en = "Daughter of Loyalty & Unfailing Devotion",
                    sw = "Binti wa Uaminifu na Upendo wa Kweli"
                ),
                scriptureRef = "Ruth 1:16",
                scriptureText = BilingualText(
                    en = "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.",
                    sw = "Uendako nitakwenda, na ukaapo nitakaa; watu wako watakuwa watu wangu, na Mungu wako atakuwa Mungu wangu."
                ),
                affirmation = BilingualText(
                    en = "My loyalty and quiet integrity are planting seeds for a generational blessing.",
                    sw = "Uaminifu wangu na unyenyekevu wangu vinapanda mbegu za baraka za vizazi."
                ),
                sisterhoodAudioTitle = "Sisterhood Voice Note • Ruth's Loyalty",
                sisterhoodNarrationEn = "Sister, small steps of loyalty have eternal impact. When Ruth stepped into Naomi's grief and went into the fields to glean, she did not know a Redeemer was waiting for her. Stay faithful in the ordinary moments today. God is weaving your kindness into a master tapestry of redemption.",
                sisterhoodNarrationSw = "Dada yangu, uaminifu katika mambo madogo una matokeo ya milele. Ruthu alipoingia shambani kuokota masuke, hakujua kwamba Mkombozi alikuwa akimsubiri. Baki mwaminifu katika mambo ya kila siku. Mungu anabadilisha wema wako kuwa ushuhuda mkuu.",
                audioDurationSeconds = 90,
                prompts = GuidedPrompt(
                    surrender = BilingualText(
                        en = "What past disappointment are you leaving behind to glean in God's new field?",
                        sw = "Ni majonzi gani ya nyuma unayoyaacha ili kuvuna katika shamba jipya la Mungu?"
                    ),
                    courage = BilingualText(
                        en = "Where is God calling you to show steadfast loyalty and kindness this week?",
                        sw = "Wapi Mungu anakuita kuonyesha uaminifu na wema thabiti wiki hii?"
                    ),
                    waiting = BilingualText(
                        en = "How is God quietly redeeming your story through small, daily acts of obedience?",
                        sw = "Jinsi gani Mungu anavyobadilisha maisha yako kupitia utii wa kila siku?"
                    )
                )
            ),
            DailySanctuary(
                archetype = "Deborah",
                title = BilingualText(
                    en = "Judge, Prophetess & Mother in Israel",
                    sw = "Mwamuzi, Nabii na Mama wa Imani"
                ),
                scriptureRef = "Judges 5:7",
                scriptureText = BilingualText(
                    en = "Villagers in Israel would not fight; they held back until I, Deborah, arose, until I arose, a mother in Israel.",
                    sw = "Wakuu walikoma katika Israeli, walikoma, hadi nilipoinuka mimi Debora, nilipoinuka, mama katika Israeli."
                ),
                affirmation = BilingualText(
                    en = "God has placed heavenly wisdom upon my tongue. I rise to bring peace, order, and vision.",
                    sw = "Mungu ameweka hekima ya mbinguni kwenye ulimi wangu. Ninainuka kuleta amani na maono."
                ),
                sisterhoodAudioTitle = "Sisterhood Voice Note • Deborah's Boldness",
                sisterhoodNarrationEn = "Arise, sister. Deborah did not wait for approval; when the community was paralyzed, she stood as a mother and leader in faith. You carry spiritual authority in your home, workplace, and prayer closet. Speak words of life, wisdom, and victory over your family today.",
                sisterhoodNarrationSw = "Inuka, dada yangu. Debora hakusubiri ruhusa; jamii ilipokata tamaa, alisimama kama mama na kiongozi wa imani. Unabeba mamlaka ya kiroho nyumbani kwako na kazini kwako. Nena maneno ya uzima, hekima na ushindi leo.",
                audioDurationSeconds = 90,
                prompts = GuidedPrompt(
                    surrender = BilingualText(
                        en = "What conflict or responsibility are you asking the Holy Spirit to guide with clarity?",
                        sw = "Ni changamoto ipi unayomwomba Roho Mtakatifu kuiongoza kwa hekima?"
                    ),
                    courage = BilingualText(
                        en = "Step into your spiritual authority: what environment needs your maternal peace today?",
                        sw = "Simama katika ujasiri wa imani: ni mazingira yapi yanayohitaji amani yako leo?"
                    ),
                    waiting = BilingualText(
                        en = "Are you waiting on God's battle trumpet before you act?",
                        sw = "Je, unamsikiliza Mungu kabla ya kuchukua hatua?"
                    )
                )
            ),
            DailySanctuary(
                archetype = "Mary",
                title = BilingualText(
                    en = "Handmaid of Grace & Favored Mother",
                    sw = "Mtumishi wa Neema na Mama Mbarikiwa"
                ),
                scriptureRef = "Luke 1:38",
                scriptureText = BilingualText(
                    en = "I am the Lord's servant; may your word to me be fulfilled.",
                    sw = "Tazama, mimi ni mjakazi wa Bwana; na iwe kwangu kama ulivyosema."
                ),
                affirmation = BilingualText(
                    en = "I am deeply favored and chosen. My soul magnifies the Lord, for He does great things in me.",
                    sw = "Nimebarikiwa na kuchaguliwa. Roho yangu inamtukuza Bwana kwa mambo makuu aliyonitendea."
                ),
                sisterhoodAudioTitle = "Sisterhood Voice Note • Mary's Surrender",
                sisterhoodNarrationEn = "Peace be with you, sister. Mary's quiet 'Yes' changed the course of human history. Even when she could not foresee the path ahead, she trusted the character of God. Say 'Yes' to His purpose today. You are favored, sheltered, and deeply beloved.",
                sisterhoodNarrationSw = "Amani iwe nawe, dada yangu. Kauli ya Mariamu 'Na iwe kwangu' ilibadilisha historia ya dunia. Hata bila kujua ya kesho, alimwamini Mungu. Sema 'Ndiyo' kwa kusudi Lake leo. Umebarikiwa, umelindwa na unapendwa sana na Mungu.",
                audioDurationSeconds = 90,
                prompts = GuidedPrompt(
                    surrender = BilingualText(
                        en = "Say 'Yes' to God's unexpected plan: what control are you ready to relinquish?",
                        sw = "Sema 'Ndiyo' kwa mpango wa Mungu: ni udhibiti upi uko tayari kuuachia?"
                    ),
                    courage = BilingualText(
                        en = "Can you trust that nothing is impossible with God in your current season?",
                        sw = "Je, unaamini kwamba hakuna jambo lisilowezekana kwa Mungu katika msimu huu?"
                    ),
                    waiting = BilingualText(
                        en = "Like Mary pondering in her heart, how are you treasuring God's quiet promises?",
                        sw = "Kama Mariamu alivyoweka mambo moyoni, unazithaminije ahadi za Mungu?"
                    )
                )
            )
        )

        fun todaySanctuary(): DailySanctuary {
            val day = Calendar.getInstance().get(Calendar.DAY_OF_YEAR)
            return Deck[day % Deck.size]
        }

        val SampleAnsweredPrayers: List<AnsweredPrayer> = listOf(
            AnsweredPrayer(
                id = "p1",
                category = "Family",
                authorName = "Sarah M.",
                location = "Nairobi",
                dateText = "2 days ago",
                testimony = "After 8 months of praying at the Altar for my daughter's university visa and breakthrough, the approval arrived yesterday! God is faithful.",
                scriptureRef = "1 Samuel 1:27",
                prayedDays = 42
            ),
            AnsweredPrayer(
                id = "p2",
                category = "Peace",
                authorName = "Amina K.",
                location = "Mombasa",
                dateText = "Yesterday",
                testimony = "Surrendered my severe work burnout and anxiety. Wrote my petition in my private journal, and a supernatural peace flooded my heart.",
                scriptureRef = "Philippians 4:7",
                prayedDays = 14
            ),
            AnsweredPrayer(
                id = "p3",
                category = "Business",
                authorName = "Grace W.",
                location = "London",
                dateText = "3 days ago",
                testimony = "Believed God for our boutique retail contract after a painful client loss. God provided a customer 3x larger who paid upfront!",
                scriptureRef = "Proverbs 31:18",
                prayedDays = 28
            ),
            AnsweredPrayer(
                id = "p4",
                category = "Peace",
                authorName = "Wanjiku N.",
                location = "Nakuru",
                dateText = "This morning",
                testimony = "Reconciled with my estranged sister after a tearful prayer of forgiveness during morning devotion. God healed our family bond.",
                scriptureRef = "Colossians 3:13",
                prayedDays = 21
            )
        )
    }
}
