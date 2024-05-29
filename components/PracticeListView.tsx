import { useState, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/helpers/supabase";
import PracticeGrid from "@/components/PracticeGrid";

export default function PracticeList() {
  const [practices, setPractices] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newPracticeName, setNewPracticeName] = useState("");
  const [newPracticeTitle, setNewPracticeTitle] = useState("");

  useEffect(() => {
    getPracticesFromSupabase();
  }, []);

  async function getPracticesFromSupabase() {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      let userId = null;
      if (userData && userData.user && !userError) {
        userId = userData.user.id;
      } else throw userError;

      const { data } = await supabase
        .from("Practices")
        .select()
        .eq("user_id", userId)
        .not("do100reps_title", "is", null);

      if (data) {
        const groupedPractices = data.reduce((groups, practice) => {
          const category = practice.category;
          if (!groups[category]) {
            groups[category] = [];
          }
          groups[category].push(practice);
          return groups;
        }, {});

        // Convert object to array of sections
        const sections = Object.keys(groupedPractices).map((category) => ({
          title: category,
          data: groupedPractices[category],
        }));
        setPractices(sections);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createNewPractice() {
    if (!newPracticeName || !newPracticeTitle) return;

    const { error } = await supabase
      .from("Practices")
      .insert({ name: newPracticeName, do100reps_title: newPracticeTitle });

    console.log(newPracticeName);
    console.log(newPracticeTitle);

    if (!error) {
      setModalVisible(false);
      getPracticesFromSupabase();
    } else {
      console.error(error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        style={{ marginLeft: 12, marginRight: 12, marginTop: 12 }}
        sections={practices}
        keyExtractor={(item) => item.do100reps_title}
        renderItem={({ item }) => (
          <Link href={"/practice/" + item.id}>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                borderRadius: 5,
                padding: 12,
                marginBottom: 12,
                elevation: 5,
                width: "100%",
              }}
            >
              <View style={{ marginRight: 5 }}>
                <PracticeGrid nextRep={item.do100reps_count + 1} size={9} />
              </View>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ marginBottom: 5 }}>{item.name}</Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {item.do100reps_title}
                </Text>
                <Text style={{ marginTop: 5 }}>
                  Completed reps: {item.do100reps_count}/100
                </Text>
              </View>
            </View>
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{ margin: 12, fontWeight: "bold" }}>
            {title != "null" ? title : ""}
          </Text>
        )}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ marginTop: 24, marginRight: 12, marginLeft: 12 }}>
          <View style={{ marginTop: 36, marginRight: 12, marginLeft: 12 }}>
            <Text>New practice short name</Text>
            <TextInput
              style={{
                margin: 12,
                borderWidth: 1,
              }}
              onChangeText={(text) => setNewPracticeName(text)}
              value={newPracticeName}
            />
            <Text>
              New practice title - for best results describe the unit of
              progress (what you consider one rep) and the goal of doing them.
            </Text>
            <TextInput
              style={{
                margin: 12,
                borderWidth: 1,
              }}
              onChangeText={(text) => setNewPracticeTitle(text)}
              value={newPracticeTitle}
            />
            <View style={{ flexDirection: "row" }}>
              <Pressable onPress={createNewPractice} style={{ margin: 12 }}>
                <Text>Save</Text>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={{ margin: 12 }}
              >
                <Text>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Pressable
        style={{
          margin: 12,
          alignItems: "flex-end",
        }}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text>Add Practice</Text>
      </Pressable>
    </View>
  );
}
