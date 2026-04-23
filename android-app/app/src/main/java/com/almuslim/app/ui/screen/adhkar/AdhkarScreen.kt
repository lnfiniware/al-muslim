package com.almuslim.app.ui.screen.adhkar

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.almuslim.app.domain.model.Adhkar
import com.almuslim.app.domain.model.AdhkarCategory
import com.almuslim.app.ui.theme.LocalExtendedColors

/**
 * Adhkar screen with category tabs and counter cards.
 * Fixes Bug #2: uses ScrollableTabRow so labels are never truncated.
 */
@Composable
fun AdhkarScreen(viewModel: AdhkarViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsState()
    val categories = AdhkarCategory.entries

    Column(modifier = Modifier.fillMaxSize()) {
        // Category tabs -- ScrollableTabRow fixes Bug #2
        ScrollableTabRow(
            selectedTabIndex = categories.indexOf(state.selectedCategory),
            edgePadding = 12.dp,
            containerColor = MaterialTheme.colorScheme.surface,
            contentColor = MaterialTheme.colorScheme.primary,
            divider = { HorizontalDivider(thickness = 0.5.dp) },
        ) {
            categories.forEach { category ->
                Tab(
                    selected = state.selectedCategory == category,
                    onClick = { viewModel.selectCategory(category) },
                    text = {
                        Text(
                            text = category.displayName,
                            fontWeight = if (state.selectedCategory == category) FontWeight.Bold else FontWeight.Normal,
                            maxLines = 1,
                        )
                    },
                )
            }
        }

        if (state.isLoading) {
            Box(Modifier.fillMaxSize(), Alignment.Center) { CircularProgressIndicator() }
        } else {
            LazyColumn(
                contentPadding = PaddingValues(vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                items(state.adhkarList, key = { it.id }) { adhkar ->
                    AdhkarCardItem(
                        adhkar = adhkar,
                        currentCount = state.progress[adhkar.id] ?: 0,
                        onIncrement = { viewModel.increment(adhkar) },
                        onReset = { viewModel.reset(adhkar.id) },
                    )
                }
            }
        }
    }
}

@Composable
private fun AdhkarCardItem(
    adhkar: Adhkar,
    currentCount: Int,
    onIncrement: () -> Unit,
    onReset: () -> Unit,
) {
    val isComplete = currentCount >= adhkar.count
    val progress = if (adhkar.count > 0) currentCount.toFloat() / adhkar.count else 0f
    val ext = LocalExtendedColors.current
    val cardColor by animateColorAsState(
        if (isComplete) ext.success.copy(alpha = 0.08f) else MaterialTheme.colorScheme.surface,
        label = "cardColor",
    )

    Card(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = cardColor),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Arabic text
            Text(
                text = adhkar.text,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.primary,
                textAlign = TextAlign.End,
                modifier = Modifier.fillMaxWidth(),
                lineHeight = MaterialTheme.typography.titleMedium.lineHeight * 1.4f,
            )
            // Reference
            adhkar.reference?.let {
                Spacer(Modifier.height(4.dp))
                Text(it, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Spacer(Modifier.height(8.dp))
            // English
            Text(adhkar.englishTranslation, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurface)

            // Progress
            Spacer(Modifier.height(12.dp))
            LinearProgressIndicator(
                progress = { progress.coerceIn(0f, 1f) },
                modifier = Modifier.fillMaxWidth().height(6.dp),
                color = if (isComplete) ext.success else ext.warning,
                trackColor = MaterialTheme.colorScheme.outlineVariant,
            )
            Spacer(Modifier.height(4.dp))
            Text("$currentCount / ${adhkar.count}", style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.End)

            // Buttons
            Spacer(Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                    onClick = onIncrement, enabled = !isComplete,
                    modifier = Modifier.weight(1f), shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isComplete) ext.success.copy(alpha = 0.3f) else MaterialTheme.colorScheme.primary,
                    ),
                ) {
                    Text(if (isComplete) "Done" else "Count")
                }
                if (currentCount > 0) {
                    OutlinedButton(onClick = onReset, shape = RoundedCornerShape(8.dp)) {
                        Icon(Icons.Outlined.Refresh, null, Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Reset")
                    }
                }
            }
        }
    }
}
