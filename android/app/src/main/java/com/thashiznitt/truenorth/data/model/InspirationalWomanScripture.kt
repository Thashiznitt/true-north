package com.thashiznitt.truenorth.data.model

import java.util.Calendar

/**
 * Model representing inspirational female figures in the Bible to inspire women of faith.
 * Features heroines of faith across scripture with their character virtues, key scripture quotes,
 * and quiet devotional reflections.
 */
data class InspirationalWomanScripture(
    val id: String,
    val name: String,
    val title: String,
    val scripture: String,
    val reference: String,
    val devotionNote: String,
    val virtueTag: String,
    val emoji: String,
    val bookId: String,
    val bookName: String,
    val chapter: Int,
    val verseNumber: Int
) {
    fun toVerseItem(isBookmarked: Boolean = false, tagColor: String? = "pink"): VerseItem {
        return VerseItem(
            bookId = bookId,
            bookName = bookName,
            chapter = chapter,
            verseNumber = verseNumber,
            text = scripture,
            isBookmarked = isBookmarked,
            tagColor = tagColor
        )
    }

    companion object {
        val Deck: List<InspirationalWomanScripture> = listOf(
            InspirationalWomanScripture(
                id = "mary_bethany",
                name = "Mary of Bethany",
                title = "Devoted Disciple at Jesus' Feet",
                scripture = "Mary sat at the Lord’s feet listening to what He said... Mary has chosen what is better, and it will not be taken away from her.",
                reference = "Luke 10:39, 42",
                devotionNote = "Sit quietly in the presence of Jesus. Choosing communion at His feet is the one thing that will never be taken from you.",
                virtueTag = "Devoted Worship",
                emoji = "🕊️",
                bookId = "luk",
                bookName = "Luke",
                chapter = 10,
                verseNumber = 42
            ),
            InspirationalWomanScripture(
                id = "esther",
                name = "Queen Esther",
                title = "Queen of Courage & Divine Purpose",
                scripture = "And who knows but that you have come to your royal position for such a time as this?",
                reference = "Esther 4:14",
                devotionNote = "You were created with holy purpose. Walk with boldness knowing God positioned you for this exact season.",
                virtueTag = "Royal Courage",
                emoji = "👑",
                bookId = "est",
                bookName = "Esther",
                chapter = 4,
                verseNumber = 14
            ),
            InspirationalWomanScripture(
                id = "ruth",
                name = "Ruth",
                title = "Daughter of Devotion & Covenant Faith",
                scripture = "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.",
                reference = "Ruth 1:16",
                devotionNote = "Your quiet loyalty, steadfast love, and integrity never go unnoticed in the eyes of God.",
                virtueTag = "Steadfast Devotion",
                emoji = "🌾",
                bookId = "rut",
                bookName = "Ruth",
                chapter = 1,
                verseNumber = 16
            ),
            InspirationalWomanScripture(
                id = "mary_nazareth",
                name = "Mary of Nazareth",
                title = "Mother of Surrender & Blessed Faith",
                scripture = "My soul magnifies the Lord, and my spirit rejoices in God my Savior... Blessed is she who believed what was promised!",
                reference = "Luke 1:45-47",
                devotionNote = "A humble and surrendered heart makes room for God to perform miracles beyond all measure.",
                virtueTag = "Humble Surrender",
                emoji = "✨",
                bookId = "luk",
                bookName = "Luke",
                chapter = 1,
                verseNumber = 45
            ),
            InspirationalWomanScripture(
                id = "hannah",
                name = "Hannah",
                title = "Woman of Unshakable Prayer",
                scripture = "My heart exults in the Lord; my strength is exalted in my God... For this child I prayed, and the Lord has granted my petition.",
                reference = "1 Samuel 2:1, 1:27",
                devotionNote = "Pour out your deepest desires before God. He hears every quiet tear and answers with tender love.",
                virtueTag = "Persistent Prayer",
                emoji = "🕊️",
                bookId = "1sa",
                bookName = "1 Samuel",
                chapter = 1,
                verseNumber = 27
            ),
            InspirationalWomanScripture(
                id = "deborah",
                name = "Deborah",
                title = "Prophetess, Judge & Mother in Israel",
                scripture = "Villagers in Israel would not fight; they held back until I, Deborah, arose, until I arose, a mother in Israel.",
                reference = "Judges 5:7",
                devotionNote = "Step forward with the righteous wisdom and courage God placed inside you to lead and bring peace.",
                virtueTag = "Wisdom & Leadership",
                emoji = "⚖️",
                bookId = "jdg",
                bookName = "Judges",
                chapter = 5,
                verseNumber = 7
            ),
            InspirationalWomanScripture(
                id = "miriam",
                name = "Miriam",
                title = "Prophetess of Praise & Worship",
                scripture = "Sing to the Lord, for he has triumphed gloriously; the horse and his rider he has thrown into the sea.",
                reference = "Exodus 15:21",
                devotionNote = "Lift up your voice with tambourines and joy. Worship breaks through battles and celebrates God's victory.",
                virtueTag = "Victorious Praise",
                emoji = "🪘",
                bookId = "exo",
                bookName = "Exodus",
                chapter = 15,
                verseNumber = 21
            ),
            InspirationalWomanScripture(
                id = "abigail",
                name = "Abigail",
                title = "Woman of Discernment & Peacemaking",
                scripture = "The woman was intelligent and beautiful... 'Blessed be your good judgment and blessed be you, who have kept me this day from bloodguilt.'",
                reference = "1 Samuel 25:3, 33",
                devotionNote = "Gentle words spoken with grace and discernment have the power to disarm conflict and protect hearts.",
                virtueTag = "Wise Discernment",
                emoji = "🌿",
                bookId = "1sa",
                bookName = "1 Samuel",
                chapter = 25,
                verseNumber = 33
            ),
            InspirationalWomanScripture(
                id = "mary_magdalene",
                name = "Mary Magdalene",
                title = "First Witness of Hope & Resurrection",
                scripture = "Mary Magdalene went and announced to the disciples: 'I have seen the Lord!'—and he had spoken these words to her.",
                reference = "John 20:18",
                devotionNote = "Your past does not define your destiny. Jesus calls your name and makes you a bearer of living hope.",
                virtueTag = "Living Hope",
                emoji = "🌅",
                bookId = "jhn",
                bookName = "John",
                chapter = 20,
                verseNumber = 18
            ),
            InspirationalWomanScripture(
                id = "lydia",
                name = "Lydia",
                title = "Woman of Open Heart & Generous Fellowship",
                scripture = "A worshiper of God was listening. The Lord opened her heart to pay attention to what was said, and her home was blessed.",
                reference = "Acts 16:14",
                devotionNote = "Open your heart and home with grace. God uses faithful women of hospitality to plant seeds of faith.",
                virtueTag = "Hospitality & Grace",
                emoji = "💜",
                bookId = "act",
                bookName = "Acts",
                chapter = 16,
                verseNumber = 14
            ),
            InspirationalWomanScripture(
                id = "elizabeth",
                name = "Elizabeth",
                title = "Patient Righteousness & Holy Spirit Joy",
                scripture = "The Lord has done this for me. In these days he has shown his favor... The baby leaped for joy, and she was filled with the Holy Spirit.",
                reference = "Luke 1:25, 41",
                devotionNote = "When waiting feels long, trust that God is preparing a harvest of supernatural blessing and favor.",
                virtueTag = "Patient Faith",
                emoji = "🕊️",
                bookId = "luk",
                bookName = "Luke",
                chapter = 1,
                verseNumber = 41
            ),
            InspirationalWomanScripture(
                id = "priscilla",
                name = "Priscilla",
                title = "Teacher & Coworker in Gospel Truth",
                scripture = "They welcomed him into their home and explained to him the way of God more accurately.",
                reference = "Acts 18:26",
                devotionNote = "Immerse yourself in scripture. Your understanding and guidance are vital to building up others.",
                virtueTag = "Truth & Discipleship",
                emoji = "📖",
                bookId = "act",
                bookName = "Acts",
                chapter = 18,
                verseNumber = 26
            ),
            InspirationalWomanScripture(
                id = "sarah",
                name = "Sarah",
                title = "Mother of Promise & Holy Laughter",
                scripture = "God has brought me laughter, and everyone who hears will laugh with me. Is anything too hard for the Lord?",
                reference = "Genesis 21:6, 18:14",
                devotionNote = "Nothing is impossible for God. He turns seasons of barrenness into joyful laughter and fulfilled promises.",
                virtueTag = "Joyful Promise",
                emoji = "🌻",
                bookId = "gen",
                bookName = "Genesis",
                chapter = 21,
                verseNumber = 6
            ),
            InspirationalWomanScripture(
                id = "rahab",
                name = "Rahab",
                title = "Courageous Faith & Redeemed Heritage",
                scripture = "By faith Rahab received the messengers in peace... For the Lord your God, he is God in the heavens above and on the earth beneath.",
                reference = "Joshua 2:11, Hebrews 11:31",
                devotionNote = "One courageous step of faith rewrites your heritage and anchors your life in God's eternal covenant.",
                virtueTag = "Courageous Faith",
                emoji = "❤️",
                bookId = "jos",
                bookName = "Joshua",
                chapter = 2,
                verseNumber = 11
            )
        )

        /**
         * Returns the inspirational woman quote of the day deterministically based on day of year.
         */
        fun getQuoteOfTheDay(offset: Int = 0): InspirationalWomanScripture {
            val cal = Calendar.getInstance()
            val dayOfYear = cal.get(Calendar.DAY_OF_YEAR) + offset
            val index = Math.floorMod(dayOfYear, Deck.size)
            return Deck[index]
        }
    }
}
