package com.almuslim.app.ui.screen.quran

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.almuslim.app.ui.theme.AlMuslimColors
import com.almuslim.app.ui.theme.AmiriFontFamily
import com.almuslim.app.ui.theme.LocalExtendedColors

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuranReaderScreen(
    surahNumber: Int,
    onBack: () -> Unit,
    onNavigateToSurah: (Int) -> Unit,
    viewModel: QuranViewModel = hiltViewModel(),
) {
    LaunchedEffect(surahNumber) { viewModel.loadSurah(surahNumber) }
    val state by viewModel.readerState.collectAsState()
    val extColors = LocalExtendedColors.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(state.surah?.name ?: "Loading...") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = AlMuslimColors.QuranBackground,
                    titleContentColor = AlMuslimColors.QuranVerseText,
                    navigationIconContentColor = AlMuslimColors.QuranVerseText,
                ),
            )
        },
        bottomBar = {
            Surface(color = AlMuslimColors.QuranBackground, tonalElevation = 0.dp) {
                Row(
                    Modifier.fillMaxWidth().padding(8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    TextButton(
                        onClick = { if (surahNumber > 1) onNavigateToSurah(surahNumber - 1) },
                        enabled = surahNumber > 1,
                    ) {
                        Icon(Icons.Default.ChevronLeft, null, Modifier.size(18.dp))
                        Text("Previous")
                    }
                    Text(
                        "$surahNumber / 114",
                        color = AlMuslimColors.QuranVerseText.copy(alpha = 0.7f),
                        style = MaterialTheme.typography.labelLarge,
                    )
                    TextButton(
                        onClick = { if (surahNumber < 114) onNavigateToSurah(surahNumber + 1) },
                        enabled = surahNumber < 114,
                    ) {
                        Text("Next")
                        Icon(Icons.Default.ChevronRight, null, Modifier.size(18.dp))
                    }
                }
            }
        },
        containerColor = AlMuslimColors.QuranBackground,
    ) { padding ->
        if (state.isLoading) {
            Box(Modifier.fillMaxSize().padding(padding), Alignment.Center) {
                CircularProgressIndicator(color = extColors.quranGoldAccent)
            }
        } else {
            LazyColumn(
                modifier = Modifier.padding(padding),
                contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
            ) {
                // Bismillah header (skip for Surah At-Tawbah #9)
                if (surahNumber != 9) {
                    item {
                        Column(
                            Modifier.fillMaxWidth().padding(bottom = 24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            Text(
                                text = "\u0628\u0650\u0633\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0645\u064E\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650",
                                fontSize = 26.sp,
                                color = extColors.quranGoldAccent,
                                textAlign = TextAlign.Center,
                                fontFamily = AmiriFontFamily,
                                fontWeight = FontWeight.SemiBold,
                            )
                            Spacer(Modifier.height(8.dp))
                            HorizontalDivider(
                                Modifier.width(80.dp),
                                color = extColors.quranGoldAccent.copy(alpha = 0.3f),
                            )
                        }
                    }
                }

                // Verses
                itemsIndexed(state.ayahs) { index, ayah ->
                    Column(
                        Modifier.fillMaxWidth().padding(bottom = 24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        // Verse number badge
                        Box(
                            Modifier.size(32.dp)
                                .clip(CircleShape)
                                .background(
                                    brush = Brush.linearGradient(
                                        listOf(
                                            extColors.quranGoldAccent.copy(alpha = 0.2f),
                                            extColors.quranGoldAccent.copy(alpha = 0.1f),
                                        )
                                    )
                                ),
                            Alignment.Center,
                        ) {
                            Text(
                                "${ayah.numberInSurah}",
                                style = MaterialTheme.typography.labelSmall,
                                color = extColors.quranGoldAccent,
                                fontWeight = FontWeight.Bold,
                            )
                        }
                        Spacer(Modifier.height(12.dp))
                        // Verse text -- UTF-8 Arabic with Amiri font (Bug #11 fix)
                        Text(
                            text = ayah.text,
                            fontSize = 22.sp,
                            lineHeight = 42.sp,
                            color = AlMuslimColors.QuranVerseText,
                            textAlign = TextAlign.Center,
                            fontFamily = AmiriFontFamily,
                            fontWeight = FontWeight.Normal,
                            modifier = Modifier.fillMaxWidth(),
                        )
                    }
                }
            }
        }
    }
}
