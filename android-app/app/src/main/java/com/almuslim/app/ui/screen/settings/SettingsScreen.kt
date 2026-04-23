package com.almuslim.app.ui.screen.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

/**
 * Settings screen.
 *
 * All toggles here write to DataStore, and the theme-related ones
 * are observed by the root AlMuslimTheme composable for global propagation.
 *
 * Ported from: app/(tabs)/settings.tsx
 * Fixes: Bug #3 (theme propagation), Bug #4 (button layout)
 */
@Composable
fun SettingsScreen(
    settingsViewModel: SettingsViewModel,
) {
    val settings by settingsViewModel.settings.collectAsState()
    var showThemeDialog by remember { mutableStateOf(false) }
    var showLanguageDialog by remember { mutableStateOf(false) }
    var showMadhabDialog by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        // Header
        Text(
            text = "Settings",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(start = 16.dp, top = 16.dp, bottom = 8.dp),
        )

        // Appearance section
        SettingsSection(title = "Appearance", icon = Icons.Outlined.Palette) {
            SettingsClickableItem(
                title = "Theme",
                subtitle = when (settings.themeMode) {
                    "light" -> "Light"
                    "dark" -> "Dark"
                    else -> "System"
                },
                onClick = { showThemeDialog = true },
            )
            SettingsSwitchItem(
                title = "AMOLED Black",
                subtitle = "Pure black for OLED displays",
                checked = settings.isAmoled,
                onCheckedChange = { settingsViewModel.setAmoled(it) },
            )
        }

        // Language section
        SettingsSection(title = "Language", icon = Icons.Outlined.Language) {
            SettingsClickableItem(
                title = "App Language",
                subtitle = if (settings.language == "ar") "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" else "English",
                onClick = { showLanguageDialog = true },
            )
        }

        // Prayer section
        SettingsSection(title = "Prayer Settings", icon = Icons.Outlined.AccessTime) {
            SettingsClickableItem(
                title = "Calculation Method",
                subtitle = if (settings.madhab == "HANAFI") "Hanafi School" else "Shafi'i School",
                onClick = { showMadhabDialog = true },
            )
            SettingsSwitchItem(
                title = "24-Hour Format",
                subtitle = "Show times in 24h format",
                checked = settings.use24HourFormat,
                onCheckedChange = { settingsViewModel.setUse24HourFormat(it) },
            )
        }

        // Notifications section
        SettingsSection(title = "Notifications", icon = Icons.Outlined.Notifications) {
            SettingsSwitchItem(
                title = "Prayer Reminders",
                subtitle = "Get notified for each prayer",
                checked = settings.notificationsEnabled,
                onCheckedChange = { settingsViewModel.setNotificationsEnabled(it) },
            )
        }

        // Interaction section
        SettingsSection(title = "Interaction", icon = Icons.Outlined.TouchApp) {
            SettingsSwitchItem(
                title = "Haptic Feedback",
                subtitle = "Vibrate on counter tap",
                checked = settings.hapticsEnabled,
                onCheckedChange = { settingsViewModel.setHapticsEnabled(it) },
            )
            SettingsSwitchItem(
                title = "Keep Screen Awake",
                subtitle = "Prevent sleep on Quran and Adhkar pages",
                checked = settings.keepScreenAwake,
                onCheckedChange = { settingsViewModel.setKeepScreenAwake(it) },
            )
        }

        // About section
        SettingsSection(title = "About", icon = Icons.Outlined.Info) {
            SettingsInfoItem(title = "Version", value = "1.2.1")
            SettingsInfoItem(title = "Developer", value = "Zyad Mohamed")
            SettingsInfoItem(title = "Organization", value = "Infiniware")
        }

        Spacer(modifier = Modifier.height(32.dp))
    }

    // Theme dialog
    if (showThemeDialog) {
        AlertDialog(
            onDismissRequest = { showThemeDialog = false },
            title = { Text("Theme") },
            text = {
                Column {
                    listOf("light" to "Light", "dark" to "Dark", "system" to "System").forEach { (value, label) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            RadioButton(
                                selected = settings.themeMode == value,
                                onClick = {
                                    settingsViewModel.setThemeMode(value)
                                    showThemeDialog = false
                                },
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(label)
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showThemeDialog = false }) { Text("Cancel") }
            },
        )
    }

    // Language dialog
    if (showLanguageDialog) {
        AlertDialog(
            onDismissRequest = { showLanguageDialog = false },
            title = { Text("Language") },
            text = {
                Column {
                    listOf("en" to "English", "ar" to "\u0627\u0644\u0639\u0631\u0628\u064A\u0629").forEach { (value, label) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            RadioButton(
                                selected = settings.language == value,
                                onClick = {
                                    settingsViewModel.setLanguage(value)
                                    showLanguageDialog = false
                                },
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(label)
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showLanguageDialog = false }) { Text("Cancel") }
            },
        )
    }

    // Madhab dialog
    if (showMadhabDialog) {
        AlertDialog(
            onDismissRequest = { showMadhabDialog = false },
            title = { Text("Calculation Method") },
            text = {
                Column {
                    listOf("SHAFI" to "Shafi'i School", "HANAFI" to "Hanafi School").forEach { (value, label) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            RadioButton(
                                selected = settings.madhab == value,
                                onClick = {
                                    settingsViewModel.setMadhab(value)
                                    showMadhabDialog = false
                                },
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(label)
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showMadhabDialog = false }) { Text("Cancel") }
            },
        )
    }
}

// ── Reusable Settings Components ─────────────────────────────────────────

@Composable
private fun SettingsSection(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(modifier = Modifier.padding(top = 16.dp)) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(20.dp),
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold,
            )
        }
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        ) {
            Column(modifier = Modifier.padding(vertical = 4.dp)) {
                content()
            }
        }
    }
}

@Composable
private fun SettingsSwitchItem(
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.SemiBold)
            Text(text = subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Switch(checked = checked, onCheckedChange = onCheckedChange)
    }
}

@Composable
private fun SettingsClickableItem(
    title: String,
    subtitle: String,
    onClick: () -> Unit,
) {
    Surface(onClick = onClick) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = title, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.SemiBold)
                Text(text = subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Icon(
                Icons.Outlined.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

@Composable
private fun SettingsInfoItem(title: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(text = title, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(text = value, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
    }
}
