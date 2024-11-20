
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { designs } from '../../constants';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { logTimeSpentOnCourse, updateLearningData, fetchLearningData } from '../../lib/appwrite';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';

const Read = () => {
  const navigation = useNavigation();
  const { user, darkMode } = useGlobalContext();

  return (
    <SafeAreaView style={darkMode ? styles.wrapperDark : styles.wrapper}>
      {/* Back button positioned at the top left of the screen */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Main content container */}
      <View style={darkMode ? styles.containerDark : styles.container}>
        {/* Row for image and "Story" heading */}
        <View style={styles.row}>
          <Text style={darkMode ? styles.titleDark : styles.title}>Pillagram Lectures</Text>
        </View>

        {/* Scrollable lesson content */}
        <View style={darkMode ? styles.lessonContainerDark : styles.lessonContainer}>
          <ScrollView style={styles.scrollContainer}>
          <Text style={darkMode ? styles.lessonTextDark : styles.lessonText}>
          <Text style={darkMode ? styles.lessonSubHeadingTitleDark : styles.lessonSubHeadingTitle}>LECTURE FOR GRAMMAR PART (GramBear){"\n\n"}</Text>
          <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Part 1: Grammar – Verbs in the Past Tense{"\n\n"}</Text>
            <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Understanding Past Tense Verbs{"\n\n"}</Text>
            The past tense is crucial for storytelling and recounting events that have already occurred. It allows us to convey actions that are completed, 
            providing context and clarity. Here, we will explore the different forms of past tense verbs in more detail, with examples.{"\n\n"}
            <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>1. Simple Past Tense</Text>{"\n\n"}
                The simple past tense describes actions that were completed at a specific time in the past. The structure is typically the base verb + -ed for regular verbs.{"\n\n"}
                <Text style={styles.highlight}>Regular Verbs:{"\n\n"}</Text>
                <Text style={styles.highlight}>Walk</Text> <Icon name="arrow-forward" size={12} color="#5C6898"/> Walked: "She walked to the park yesterday."{"\n\n"}
                <Text style={styles.highlight}>Play</Text> <Icon name="arrow-forward" size={12} color="#5C6898"/> Played: "They played soccer last weekend."{"\n\n"}
                <Text style={styles.highlight}>Irregular Verbs:{"\n\n"}</Text>
                <Text style={styles.highlight}>Go</Text> <Icon name="arrow-forward" size={12} color="#5C6898"/> Went: "He went to the store."{"\n\n"}
                <Text style={styles.highlight}>Ate</Text> <Icon name="arrow-forward" size={12} color="#5C6898"/> Ate: "We ate dinner at 7PM."{"\n\n"}
                <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Usage Tips:</Text>{"\n\n"}
                • Use the <Text style={styles.highlight}>simple past</Text> for <Text style={styles.highlight}>specific past events</Text>. 
                It's often accompanied by time expressions like yesterday, last week, or in 2010.{"\n\n"}
                <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>2. Past Continuous Tense</Text>{"\n\n"}
                The past continuous tense indicates actions that were <Text style={styles.highlight}>ongoing</Text> at
                a specific time in the past. It is formed using <Text style={styles.highlight}>"was/were"</Text> 
                + the present participle (<Text style={styles.highlight}>-ing</Text> form
                of the verb).{"\n\n"}
                <Text style={styles.highlight}>Examples:</Text>{"\n\n"}
                "She was <Text style={styles.underline}>studying</Text> when I called her."{"\n\n"}
                "They were <Text style={styles.underline}>watching</Text> a movie at 8 PM."{"\n\n"}
                <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Usage Tips:</Text>{"\n\n"}
                • This tense is useful for setting the scene or describing background actions that were happening while another action occurred.{"\n\n"}
                <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>3. Past Perfect Tense</Text>{"\n\n"}
                The past perfect tense is used to show that an action was <Text style={styles.highlight}>completed</Text> before 
                another action took place in the past. It is formed using <Text style={styles.highlight}>"had" + past participle.</Text>{"\n\n"}
                <Text style={styles.highlight}>Examples:</Text>{"\n\n"}
                "They <Text style={styles.underline}>had left</Text> the party before it started to rain."{"\n\n"}
                "She <Text style={styles.underline}>had finished</Text> her homework before going out."{"\n\n"}
                <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Usage Tips:</Text>{"\n\n"}
                • This tense helps clarify the sequence of events and is often used when discussing multiple actions in the past.{"\n\n"}
                <Text style={styles.highlight}>--------------------------------------{"\n\n"}</Text>
                <Text style={darkMode ? styles.lessonSubHeadingTitleDark : styles.lessonSubHeadingTitle}>LECTURE ON NARRATIVE TEXT (Story){"\n\n"}</Text>
                Narrative text is a form of writing that tells a story. It can be fictional or non-fictional and is characterized by a structured plot, characters, and a specific setting. 
                Narratives are powerful tools in communication, allowing writers to engage readers by presenting experiences in an entertaining and relatable way.{"\n\n"}
                <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Key Components of{"\n"}Narrative Text{"\n\n"}</Text>
                <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>1. Characters</Text>
                </Text>
            {/* Bullet Point 1 */}
            <View style={styles.bulletRow}>
              <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
              <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                Characters are the individuals involved in the narrative. They can be people, animals, or even inanimate objects that take on personality traits.
              </Text>
            </View>

            {/* Bullet Point 2 */}
            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Types:</Text>
              </Text>
            </View>

            {/* Nested Bullet */}
            <View style={styles.nestedBulletRow}>
              <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
              <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Protagonist </Text>- The main character around <Text style={styles.underline}>whom the story revolves</Text>. 
                Example: Harry Potter in J.K. Rowling's series.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Antagonist </Text>- The character who <Text style={styles.underline}>opposes the protagonist</Text>. 
                Example: Voldemort in J.K. Rowling's series.
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Development</Text> - Characters should have depth and evolve throughout the story. 
                Their experiences, challenges, and growth are crucial for reader connection.
              </Text>
            </View>

            <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>2. Setting</Text>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              The setting refers to the time and place where the story occurs. It 
              provides context and backdrop for the narrative.
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Elements:</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Time </Text>- When does the story take place? Is 
                it in the past, present, or future? Is it a specific time of year, day, or era?
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Place </Text>- Where does the story happen? This can range 
                from a specific location (e.g., a school, a forest) to broader settings (e.g., a small town, a distant planet).
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Importance</Text> - A well-crafted setting can 
                enhance the mood and help readers visualize the story.
              </Text>
            </View>

            <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>3. Plot</Text>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              The plot is the sequence of events that make up the story. It 
              typically follows a structured framework.
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Structure:</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Exposition </Text>- Introduces characters, setting, and background information.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Rising Action </Text>- The series of events that 
                create tension and develop the conflict.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Rising Action </Text>- The series of events that 
                create tension and develop the conflict.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Climax </Text>- The turning point or most intense moment in the story.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Falling Action </Text>- The events following the climax, leading toward resolution.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Resolution </Text>- The conclusion of the story where conflicts are resolved. 
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Example:</Text> In "Cinderella," the plot includes her hardship, the ball, the loss of the glass slipper, 
                and the eventual happy ending.
              </Text>
            </View>

            <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>4. Conflict</Text>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              Conflict is the struggle between opposing forces, which drives the narrative forward.
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Types:</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Internal Conflict </Text>- Struggles within a character (e.g., fear, decision-making).
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>External Conflict </Text>- Struggles between a character and external 
                forces (e.g., society, nature, another character).
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Role in Narrative </Text>- Conflict is essential for character development and 
                maintaining reader interest. It creates suspense and engages readers emotionally.
              </Text>
            </View>

            <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>5. Theme</Text>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              The theme is the central idea or underlying <Text style={styles.highlight}>message</Text> of the <Text style={styles.highlight}>narrative</Text>.
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Example:</Text> Common themes include love, friendship, betrayal, courage, and the struggle between good and evil.
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>•</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Importance</Text> - A strong theme resonates with readers and encourages them to reflect on their own experiences.
              </Text>
            </View>

            <Text style={darkMode ? styles.lessonTextDark : styles.lessonText}>
            <Text style={styles.highlight}>--------------------------------------{"\n\n"}</Text>
              <Text style={darkMode ? styles.lessonSubHeadingTitleDark : styles.lessonSubHeadingTitle}>NARRATIVE TEXT{"\n\n"}</Text>
              <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Title: The Unexpected Journey{"\n\n"}</Text>
              One rainy afternoon, Emily was sitting in her room, staring out the window. 
              The raindrops danced down the glass, creating a blur of the world outside. 
              Feeling restless, she decided to take a walk to clear her mind. 
              She pulled on her boots and grabbed her umbrella, hoping the rain would let up.{"\n\n"}
              As she walked through the park, the sky began to darken even more, and a rumble of thunder echoed in the distance. 
              Just as she was about to turn back, she noticed something shiny near the old oak tree. 
              Curiosity piqued; Emily walked over to investigate. To her surprise, she found a small, ornate key lying in the mud.{"\n\n"}
              Intrigued, she picked it up and examined it closely. It was unlike any key she had ever seen, with intricate designs carved into its surface. 
              Without thinking, she decided to look for what the key might unlock. 
              As she wandered deeper into the park, she stumbled upon a hidden gate covered in vines. 
              The gate looked ancient, and Emily's heart raced with excitement.{"\n\n"}
              With trembling hands, she inserted the key into the lock. To her amazement, it turned smoothly, and the gate creaked open. 
              Beyond it lay a beautiful, enchanted garden filled with vibrant flowers and glowing lights. 
              Emily stepped through the gate, feeling as though she had entered a different world. Little did she know, this unexpected journey would change her life forever.{"\n\n"}
              <Text style={styles.highlight}>--------------------------------------{"\n\n"}</Text>
              <Text style={darkMode ? styles.lessonSubHeadingTitleDark : styles.lessonSubHeadingTitle}>WHY DO WE USE PAST TENSE IN NARRATIVE TEXTS? (MothGram){"\n\n"}</Text>
              In narrative writing, the past tense is commonly used to tell stories. This allows writers to describe events that have already happened, 
              helping readers engage with the plot and characters. Understanding how to effectively use the past tense is essential for crafting compelling narratives.{"\n\n"}
              <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Why Use Past Tense in Narrative Text?</Text> </Text>

              <View style={styles.bulletRow}>
              <Text style={darkMode ? styles.bulletDark : styles.bullet}>1.</Text>
              <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                  <Text style={styles.highlight}>Temporal Clarity</Text>
                </Text>
              </View>
  
              <View style={styles.nestedBulletRow}>
              <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
              <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                Using the past tense provides a clear indication that the events being described are complete and occurred before the present moment. 
                This helps readers understand the timeline of the story.
                </Text>
              </View>
  
              <View style={styles.bulletRow}>
              <Text style={darkMode ? styles.bulletDark : styles.bullet}>2.</Text>
              <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                  <Text style={styles.highlight}>Engagement</Text>
                </Text>
              </View>
  
              <View style={styles.nestedBulletRow}>
              <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
              <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                Past tense can evoke a sense of nostalgia and reflection, drawing readers into the story as they visualize events that have already transpired.
                </Text>
              </View>
  
              <View style={styles.bulletRow}>
              <Text style={darkMode ? styles.bulletDark : styles.bullet}>3.</Text>
              <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                  <Text style={styles.highlight}>Character Development</Text>
                </Text>
              </View>
  
              <View style={styles.nestedBulletRow}>
              <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
              <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                Writing in the past tense allows writers to reveal characters’ histories and backgrounds, providing context for their actions and motivations.
                </Text>
              </View>
             
              <Text style={darkMode ? styles.lessonTextDark : styles.lessonText}>
              <Text style={styles.highlight}>--------------------------------------{"\n\n"}</Text>
              <Text style={darkMode ? styles.lessonSubHeadingTitleDark : styles.lessonSubHeadingTitle}>CONTEXT CLUES (TaleTime){"\n\n"}</Text>
              <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Short Lecture on Context Clues in Reading Narrative Texts{"\n\n"}</Text>
              <Text style={styles.highlight}>CONTEXT CLUES</Text> are hints or information within a text that help readers understand the meaning of unfamiliar words or phrases. 
              In narrative texts, context clues play a crucial role in enhancing comprehension and enriching the reading experience.{"\n\n"}
              <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Types of Context Clues{"\n"}</Text>
              </Text>

             

            {/* Nested Bullet */}
            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>1.</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Synonyms</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              A word or phrase with a similar meaning is used in the sentence, helping to clarify the unfamiliar word.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              Example: “The puppy was frightened, or scared, by the loud noise.”
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>2.</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Antonyms</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              A word or phrase with the opposite meaning can provide insight into the unfamiliar term.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              Example: “Unlike her timid brother, Mia was quite bold in exploring the forest.”
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>3.</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Definitions</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              The unfamiliar word is explained directly within the sentence.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              Example: “The enchantment (a magical spell) in the forest captivated everyone who entered.”
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>4.</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Examples</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              Specific examples can help clarify the meaning of a word.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              Example: “The forest was home to many creatures, such as deer, rabbits, and foxes.”
              </Text>
            </View>

            <View style={styles.bulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>5.</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
                <Text style={styles.highlight}>Inferences</Text>
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              Readers can deduce meanings based on their understanding of the overall context and their own experiences.
              </Text>
            </View>

            <View style={styles.nestedBulletRow}>
            <Text style={darkMode ? styles.bulletDark : styles.bullet}>○</Text>
            <Text style={darkMode ? styles.bulletTextDark : styles.bulletText}>
              Example: “After the storm, the streets were covered in debris, and the townspeople mourned for the damage done.” (Here, “mourned” implies sadness.)
              </Text>
            </View>

            <Text style={darkMode ? styles.lessonTextDark : styles.lessonText}>
            <Text style={styles.highlight}>--------------------------------------{"\n\n"}</Text>
            <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Title: The Mysterious Forest{"\n\n"}</Text>
            As the sun began to set, Mia ventured into the dense forest behind her house. The trees were tall and ancient, their trunks covered in thick, green moss. 
            She had always heard stories about this place, tales of magic and wonder. 
            With each step, she felt a mixture of excitement and trepidation.{"\n\n"}
            Suddenly, Mia stumbled upon a hidden clearing filled with vibrant flowers that glowed softly in the twilight. 
            In the center stood a sparkling fountain, its water cascading gently over smooth stones. 
            Entranced, she approached the fountain and noticed something shimmering at the bottom. It looked like a small, intricately designed key.{"\n\n"}
            Before she could reach for it, a gentle voice interrupted her thoughts. "That key unlocks the secrets of the forest," it said. 
            Mia turned to see a wise old owl perched on a branch nearby. "But be cautious; not all secrets are meant to be uncovered."{"\n\n"}
              <Text style={styles.highlight}>--------------------------------------{"\n\n"}</Text>
              <Text style={darkMode ? styles.lessonSubHeadingDark : styles.lessonSubHeading}>Title: The Forgotten Garden{"\n\n"}</Text>
              Emily had always heard stories about her grandmother’s garden, a place filled with flowers that bloomed in every color imaginable. 
              One sunny afternoon, she decided to explore the overgrown yard behind her grandmother’s old house. 
              As she pushed aside the tangled vines and tall weeds, a sense of nostalgia washed over her.{"\n\n"}
              Suddenly, she stumbled upon a small gate, barely visible beneath the thick foliage. Curious, she opened it and stepped inside. 
              To her amazement, the garden was more beautiful than she had ever imagined. 
              Vivid blossoms danced in the gentle breeze, and the sweet fragrance of jasmine filled the air. 
              In the center, an ancient fountain sparkled in the sunlight, its water trickling melodiously.{"\n\n"}
              Emily felt a surge of happiness as she wandered through the garden, discovering hidden paths and secret nooks. 
              It was as if she had uncovered a treasure trove of memories, each flower whispering stories of her family’s past. 
              She knew that this magical place was a piece of her heritage, waiting to be cherished once more.{"\n\n"}
              <Text style={styles.highlight}>--------------------------------------{"\n\n"}</Text>
              Anderson, M., & Poole, M. (2001). Assignment Writing: A Handbook for Students. New York: Palgrave.{"\n\n"}
McCarthy, M., & O’Dell, F. (2008). Academic Vocabulary in Use. Cambridge: Cambridge University Press.
            </Text>
           
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffeff7',
  },
  wrapperDark: {
    flex: 1,
    backgroundColor: '#2e375b',
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    padding: 10,
    backgroundColor: '#5C6898',
    borderRadius: 10,
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eac2cf',
    borderRadius: 10,
    margin: 20,
    marginTop: 100,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  containerDark: {
    flex: 1,
    padding: 20,
    backgroundColor: '#5c6898',
    borderRadius: 10,
    margin: 20,
    marginTop: 100,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
    paddingHorizontal: 45,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 27,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#c67b88',
    flex: 1,
    textAlign: 'center',
  },
  titleDark: {
    fontSize: 27,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#e3e3ff',
    flex: 1,
    textAlign: 'center',
  },
  lessonContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#ffeff7',
    padding: 20,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  lessonContainerDark: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#d1d5fa',
    padding: 20,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  scrollContainer: {
    flex: 1,
  },
  lessonSubHeading: {
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-Bold',
    color: '#c67b88',
    marginBottom: 5,
    margin: 10,
  },
  lessonSubHeadingDark: {
    fontSize: 20,
    fontFamily: 'BarlowSemiCondensed-Bold',
    color: '#5c6898',
    marginBottom: 5,
    margin: 10,
  },
  lessonSubHeadingTitle: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    textDecorationLine: 'underline',
    color: '#c67b88',
    marginBottom: 5,
    margin: 10,
  },
  lessonSubHeadingTitleDark: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    textDecorationLine: 'underline',
    color: '#5c6898',
    marginBottom: 5,
    margin: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  nestedBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
    paddingLeft: 20, // Add indent for nested bullets
  },
  bullet: {
    fontSize: 18,
    color: '#c67b88',
    marginRight: 10, // Space between bullet and text
    marginLeft: 10,
  },
  bulletText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#c67b88',
    flexShrink: 1,
    marginBottom: 10,
    marginTop: -3,
    marginRight: 15,
  },
  bulletDark: {
    fontSize: 18,
    color: '#5c6898',
    marginRight: 10, // Space between bullet and text
    marginLeft: 10,
  },
  bulletTextDark: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#5c6898',
    flexShrink: 1,
    marginBottom: 10,
    marginTop: -3,
    marginRight: 15,
  },
  highlight: {
    fontFamily: 'Quicksand-Bold',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  nextButton: {
    backgroundColor: '#eac2cf',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: 200,
  },
  nextButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 24,
    fontFamily: 'BarlowSemiCondensed-ExtraBold',
    color: '#5C6898',
  },
  nextButtonIcon: {
    marginLeft: 10,
  },
  lessonText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#c67b88',
    marginBottom: 10,
    marginTop: 5,
    margin: 10,
  },
  lessonTextDark: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#5c6898',
    marginBottom: 10,
    marginTop: 5,
    margin: 10,
  },
});

export default Read;
