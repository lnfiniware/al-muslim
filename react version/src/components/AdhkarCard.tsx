import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

interface AdhkarCardProps {
  id: string;
  arabicText: string;
  englishText: string;
  targetCount: number;
  currentCount?: number;
  reference?: string;
  onIncrement: (id: string) => void;
  onReset: (id: string) => void;
}

export const AdhkarCard: React.FC<AdhkarCardProps> = ({
  id,
  arabicText,
  englishText,
  targetCount,
  currentCount = 0,
  reference,
  onIncrement,
  onReset,
}) => {
  const isComplete = currentCount >= targetCount;
  const progress = (currentCount / targetCount) * 100;

  return (
    <View style={[styles.card, isComplete && styles.completedCard]}>
      <View style={styles.header}>
        <Text style={styles.arabicText}>{arabicText}</Text>
        {reference && <Text style={styles.reference}>{reference}</Text>}
      </View>

      <Text style={styles.englishText}>{englishText}</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progress, 100)}%` },
              isComplete && styles.progressFillComplete,
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentCount} / {targetCount}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isComplete && styles.buttonDisabled]}
          onPress={() => onIncrement(id)}
          disabled={isComplete}
        >
          <Text
            style={[
              styles.buttonText,
              isComplete && styles.buttonTextDisabled,
            ]}
          >
            {isComplete ? '✓ Done' : 'Count'}
          </Text>
        </TouchableOpacity>

        {currentCount > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={() => onReset(id)}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#f1f8e9',
    borderColor: '#c6e48b',
  },
  header: {
    marginBottom: 12,
  },
  arabicText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#006a4e',
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 32,
  },
  reference: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  englishText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff9800',
    borderRadius: 3,
  },
  progressFillComplete: {
    backgroundColor: '#4caf50',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#006a4e',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#c8e6c9',
  },
  resetButton: {
    backgroundColor: '#ff9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#666',
  },
});
