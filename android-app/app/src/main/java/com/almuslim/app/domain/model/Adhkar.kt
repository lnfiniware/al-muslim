package com.almuslim.app.domain.model

/**
 * A single remembrance (dhikr).
 */
data class Adhkar(
    val id: String,
    val text: String,
    val englishTranslation: String,
    val count: Int,
    val reference: String? = null,
    val category: AdhkarCategory,
)

/**
 * Category grouping for adhkar.
 */
enum class AdhkarCategory(
    val key: String,
    val displayName: String,
    val arabicName: String,
    val description: String,
) {
    MORNING(
        key = "morning",
        displayName = "Morning",
        arabicName = "أذكار الصباح",
        description = "Islamic remembrances to recite in the morning",
    ),
    EVENING(
        key = "evening",
        displayName = "Evening",
        arabicName = "أذكار المساء",
        description = "Islamic remembrances to recite in the evening",
    ),
    BEFORE_SLEEP(
        key = "before_sleep",
        displayName = "Before Sleep",
        arabicName = "أذكار قبل النوم",
        description = "Islamic remembrances before going to sleep",
    ),
    AFTER_PRAYER(
        key = "after_prayer",
        displayName = "After Prayer",
        arabicName = "أذكار بعد الصلاة",
        description = "Islamic remembrances to recite after prayer",
    ),
    MISCELLANEOUS(
        key = "miscellaneous",
        displayName = "General",
        arabicName = "أذكار متفرقة",
        description = "General Islamic remembrances",
    ),
}

/**
 * Collection of adhkar for a category.
 */
data class AdhkarCollection(
    val category: AdhkarCategory,
    val adhkar: List<Adhkar>,
)
