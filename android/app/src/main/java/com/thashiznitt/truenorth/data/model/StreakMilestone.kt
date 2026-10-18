package com.thashiznitt.truenorth.data.model

import com.thashiznitt.truenorth.data.local.entity.JournalEntity
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

data class StreakMilestone(
    val days: Int,
    val title: String,
    val encouragementMessage: String,
    val scriptureReference: String,
    val scriptureText: String,
    val badgeLabel: String
) {
    companion object {
        val ALL_MILESTONES = listOf(
            StreakMilestone(
                days = 3,
                title = "Spark of Faith",
                badgeLabel = "3 Days",
                scriptureReference = "Zechariah 4:10",
                scriptureText = "Do not despise these small beginnings, for the Lord rejoices to see the work begin.",
                encouragementMessage = "Three consecutive days of seeking God! You have planted a holy seed in your daily life. The enemy loves to whisper that small habits don't matter, but Heaven celebrates every moment you set aside for prayer and reflection. Keep going, precious sister—your spiritual foundation is taking root."
            ),
            StreakMilestone(
                days = 7,
                title = "A Week in Grace",
                badgeLabel = "1 Week",
                scriptureReference = "Galatians 6:9",
                scriptureText = "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
                encouragementMessage = "One full week of devotion! You have completed a sacred rhythm of 7 days, walking in step with the Spirit. When life got busy and distractions pulled at your attention, you chose stillness with your Heavenly Father. Let His peace guard your heart this week."
            ),
            StreakMilestone(
                days = 10,
                title = "Steadfast Heart",
                badgeLabel = "10 Days",
                scriptureReference = "Psalm 57:7",
                scriptureText = "My heart is steadfast, O God, my heart is steadfast; I will sing and give praise.",
                encouragementMessage = "Double digits of sacred reflection! Ten days proves your heart is resolved. The initial excitement may fade, but your spiritual endurance is awakening. You are showing up for God because you know He always shows up for you."
            ),
            StreakMilestone(
                days = 14,
                title = "Rooted in Love",
                badgeLabel = "2 Weeks",
                scriptureReference = "Colossians 2:6-7",
                scriptureText = "Just as you received Christ Jesus as Lord, continue to live your lives in Him, rooted and built up in Him.",
                encouragementMessage = "Two weeks of unbroken journaling! Like a tree planted beside streams of living water, your roots are sinking deeper into the soil of His unconditional love. The winds of life may blow, but your spirit is anchored in His promises."
            ),
            StreakMilestone(
                days = 21,
                title = "Sacred Habit Formed",
                badgeLabel = "3 Weeks",
                scriptureReference = "Romans 12:2",
                scriptureText = "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.",
                encouragementMessage = "Three weeks of unwavering devotion! Science tells us it takes 21 days to form a habit, but scripture tells us you are being daily renewed by the Holy Spirit. Prayer and reflection are now woven into the tapestry of your everyday rhythm."
            ),
            StreakMilestone(
                days = 30,
                title = "A Month of Living Water",
                badgeLabel = "1 Month",
                scriptureReference = "Isaiah 58:11",
                scriptureText = "The Lord will guide you always; He will satisfy your needs in a sun-scorched land and will strengthen your frame.",
                encouragementMessage = "A full month of walking with Jesus! Look back at the prayers and sermon revelations you have recorded over these 30 days—you can see His faithful hand guiding every step. You are a woman clothed in dignity and strength."
            ),
            StreakMilestone(
                days = 40,
                title = "The 40-Day Triumph",
                badgeLabel = "40 Days",
                scriptureReference = "Matthew 4:4",
                scriptureText = "People do not live on bread alone, but on every word that comes from the mouth of God.",
                encouragementMessage = "Forty sacred days! In scripture, 40 days represents transformation, testing, and spiritual breakthrough—from Moses on the mount to Jesus in the wilderness. You have conquered discouragement and proven that God's Word is the true sustenance of your life."
            ),
            StreakMilestone(
                days = 50,
                title = "Pentecost Outpouring",
                badgeLabel = "50 Days",
                scriptureReference = "Acts 2:17",
                scriptureText = "In the last days, God says, I will pour out My Spirit on all people; your daughters will prophesy.",
                encouragementMessage = "Fifty consecutive days of holy seeking! May the fire of the Holy Spirit burn brighter within you today than ever before. Your journal is a living altar where God is speaking wisdom, healing, and vision over your family and future."
            ),
            StreakMilestone(
                days = 60,
                title = "Unshakable Anchor",
                badgeLabel = "2 Months",
                scriptureReference = "Hebrews 6:19",
                scriptureText = "We have this hope as an anchor for the soul, firm and secure.",
                encouragementMessage = "Two full months of devotion! Two months of choosing worship over worry. When trials and fatigue knocked on your door, you opened your journal and poured your heart out to the Lord. Your faith is no longer fragile—it is an anchor."
            ),
            StreakMilestone(
                days = 75,
                title = "Radiant in His Light",
                badgeLabel = "75 Days",
                scriptureReference = "Psalm 34:5",
                scriptureText = "Those who look to Him are radiant; their faces are never covered with shame.",
                encouragementMessage = "Seventy-five days in His presence! You are becoming radiant with the peace of Christ. Others around you see the quiet gentleness and supernatural strength you carry. You are glowing with the light of Heaven."
            ),
            StreakMilestone(
                days = 90,
                title = "Season of Flourishing",
                badgeLabel = "3 Months",
                scriptureReference = "Psalm 1:3",
                scriptureText = "She is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither.",
                encouragementMessage = "An entire quarter—ninety continuous days! A full season of spiritual blossoming. You didn't just visit the secret place; you made it your home. You are bearing spiritual fruit that will bless generations to come."
            ),
            StreakMilestone(
                days = 100,
                title = "Century of Sacred Sisterhood",
                badgeLabel = "100 Days",
                scriptureReference = "Proverbs 31:25-26",
                scriptureText = "Strength and dignity are her clothing, and she laughs at the time to come. She opens her mouth with wisdom.",
                encouragementMessage = "One hundred days! What a monumental milestone in your walk with God. Few people ever reach 100 consecutive days of devotion. You are an inspiration to your sisters in faith, an ambassador of grace, and a daughter in whom the Father takes great delight."
            ),
            StreakMilestone(
                days = 120,
                title = "Light Upon the Path",
                badgeLabel = "4 Months",
                scriptureReference = "Psalm 119:105",
                scriptureText = "Your word is a lamp to my feet and a light to my path.",
                encouragementMessage = "Four months of constant illumination! One hundred and twenty days of letting God's Word direct your thoughts, your relationships, and your choices. You are walking in divine clarity, guided step by step by His eternal lamp."
            ),
            StreakMilestone(
                days = 150,
                title = "Abiding in the Vine",
                badgeLabel = "5 Months",
                scriptureReference = "John 15:5",
                scriptureText = "I am the vine; you are the branches. If you remain in Me and I in you, you will bear much fruit.",
                encouragementMessage = "Five months of continuous abiding! You have learned that your strength does not come from striving, but from abiding in Jesus. As you rest in His love day after day, His supernatural joy is flowing effortlessly through you."
            ),
            StreakMilestone(
                days = 180,
                title = "Faith Tested & Victorious",
                badgeLabel = "6 Months",
                scriptureReference = "1 Peter 1:7",
                scriptureText = "These have come so that the proven genuineness of your faith—of greater worth than gold—may result in praise, glory and honor.",
                encouragementMessage = "Half a year of unbroken sacred reflection! For 180 days through sunshine and storms, through high mountains and low valleys, your devotion never ceased. Your faith has been tested and refined like pure gold. Heaven honors your persistence!"
            ),
            StreakMilestone(
                days = 200,
                title = "Wellspring of Eternal Peace",
                badgeLabel = "200 Days",
                scriptureReference = "John 4:14",
                scriptureText = "The water I give them will become in them a spring of water welling up to eternal life.",
                encouragementMessage = "Two hundred days of drinking from the well that never runs dry! You have proven that the pleasures of this world cannot satisfy your soul like a quiet moment with the King. Drink deeply of His unending grace today."
            ),
            StreakMilestone(
                days = 250,
                title = "Daughter of the King",
                badgeLabel = "250 Days",
                scriptureReference = "Esther 4:14",
                scriptureText = "And who knows but that you have come to your royal position for such a time as this?",
                encouragementMessage = "Two hundred and fifty days of royal fellowship! Like Queen Esther, you were created for such a time as this. Your prayers are shifting atmospheres, blessing your home, and aligning your life with God's grand kingdom purpose."
            ),
            StreakMilestone(
                days = 300,
                title = "Beacon of Divine Wisdom",
                badgeLabel = "300 Days",
                scriptureReference = "Matthew 5:14",
                scriptureText = "You are the light of the world. A city that is set on a hill cannot be hidden.",
                encouragementMessage = "Three hundred days of holy devotion! You are a shining beacon on a hill. You have cultivated a treasury of wisdom, prayers, and answered miracles in your journal that will testify to God's goodness for years to come."
            ),
            StreakMilestone(
                days = 365,
                title = "A Sacred Year of Grace",
                badgeLabel = "1 Year",
                scriptureReference = "Psalm 65:11",
                scriptureText = "You crown the year with Your bounty, and Your carts overflow with abundance.",
                encouragementMessage = "Three hundred and sixty-five days! One entire year of uninterrupted communion with your Creator. You have crowned this year with devotion, prayer, and faith. You have lived out a historic year of spiritual victory. Receive the Father's loving affirmation: 'Well done, good and faithful daughter!'"
            )
        )

        fun getMilestoneForStreak(streak: Int): StreakMilestone? {
            return ALL_MILESTONES.lastOrNull { it.days <= streak }
        }

        fun getNextMilestone(streak: Int): StreakMilestone? {
            return ALL_MILESTONES.firstOrNull { it.days > streak }
        }

        fun getMilestoneByExactDays(days: Int): StreakMilestone? {
            return ALL_MILESTONES.firstOrNull { it.days == days }
        }

        /**
         * Calculates consecutive days of journaling from entries.
         * Streak only increments across unique calendar days.
         * If the user journaled today, starts checking from today backwards.
         * If the user hasn't journaled today yet, but journaled yesterday, the streak is alive starting yesterday.
         * Otherwise, streak is 0.
         */
        fun calculateStreak(entries: List<JournalEntity>): Int {
            if (entries.isEmpty()) return 0
            val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val uniqueDays = entries.map { dateFormat.format(Date(it.timestamp)) }.toSet()

            val calendar = Calendar.getInstance()
            val todayStr = dateFormat.format(calendar.time)
            calendar.add(Calendar.DAY_OF_YEAR, -1)
            val yesterdayStr = dateFormat.format(calendar.time)

            val checkCalendar = Calendar.getInstance()
            if (!uniqueDays.contains(todayStr)) {
                if (uniqueDays.contains(yesterdayStr)) {
                    checkCalendar.add(Calendar.DAY_OF_YEAR, -1)
                } else {
                    return 0
                }
            }

            var streak = 0
            while (true) {
                val dateStr = dateFormat.format(checkCalendar.time)
                if (uniqueDays.contains(dateStr)) {
                    streak++
                    checkCalendar.add(Calendar.DAY_OF_YEAR, -1)
                } else {
                    break
                }
            }
            return streak
        }
    }
}
