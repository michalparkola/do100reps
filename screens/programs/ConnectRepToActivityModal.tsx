import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useReps } from "@/hooks/useReps";
import { gs } from "@/global-styles";
import NextRep from "../reps/NextRep";
import { useRelateRepToActivity } from "@/hooks/useRelateRepToActivity";

interface Props {
  practice_id: string;
  activity_id: number;
}

export function ConnectRepToActivityModal({ practice_id, activity_id }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  // TODO can get practice id from activity
  const {
    isPending: isPendingReps,
    error: errorReps,
    data: reps,
  } = useReps(practice_id);

  const relateRepMutation = useRelateRepToActivity(activity_id);

  if (isPendingReps) return <Text>Loading reps...</Text>;
  if (errorReps) return <Text>Error loading reps...</Text>;

  function handleSelectRep(rep_id: number) {
    relateRepMutation.mutate(rep_id);
    setModalVisible(false);
  }

  return (
    <>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <ScrollView style={styles.modalContainer}>
          <Pressable
            onPress={() => {
              setModalVisible(false);
            }}
            style={{ padding: 10, marginRight: 10 }}
          >
            <Text>Cancel</Text>
          </Pressable>
          <View style={styles.contentContainer}>
            <Text style={gs.h2}>Create and connect a new rep</Text>
            <NextRep
              practice_id={practice_id}
              next_rep_cnt={reps.length + 1}
              activity_id={activity_id}
            />

            <Text style={[gs.h2, { marginTop: 40 }]}>
              Select an existing rep and connect it to this action
            </Text>
            <FlatList
              style={styles.flatList}
              data={reps}
              renderItem={({ item: rep, index: rep_number }) => (
                <View style={gs.repContainer}>
                  <Pressable
                    onPress={() => {
                      handleSelectRep(rep.id);
                    }}
                  >
                    <Text style={gs.repText}>{rep.summary}</Text>
                    <Text style={gs.repSecondaryText}>
                      Rep {rep_number} {rep.created_at}{" "}
                    </Text>
                  </Pressable>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </Modal>

      <Pressable
        style={gs.smallButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text>Connect Rep</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  contentContainer: {
    marginLeft: 12,
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
});
