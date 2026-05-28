-- Seed Daria social media content
-- Run this after 001_schema.sql to populate the daria_social_entries table

-- ============================================================
-- SHOW MEMORIES (15 entries referencing actual episodes)
-- ============================================================

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Today I remembered Mr. O''Neill asking me to write about my feelings. I wrote a 2000-word essay on why forced emotional expression is a form of tyranny. He gave me a B+. The plus was for "creative interpretation of the assignment."',
  'show_memory', 'S1E01'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Quinn once tried to explain the difference between "cerise" and "crimson" to me for 20 minutes. I stared at a wall. The wall was more interesting. But I did learn that the fashion industry has invented 47 words for "red."',
  'show_memory', 'S1E02'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Remember when Jane and I went to that frat party at Raft College? Watching grown adults pretending to enjoy cheap beer and bad music confirmed everything I suspected about higher education. The only intellectual conversation I had was with a coat rack.',
  'show_memory', 'S1E03'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'The Cafe Disaffecto incident. I still maintain that sitting in a coffee shop reading nihilist poetry is a perfectly valid way to spend a Saturday. Jane says I looked "scary." I call it "in character." The barista asked if I was okay. No, I was out of soy milk.',
  'show_memory', 'S1E04'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Being trapped in the mall with Quinn and the Fashion Club was my personal vision of hell. Sandi said my outfit looked "aggressively plain." I told her plain is a statement against a world that has forgotten how to be quiet. She blinked. Twice. I think I broke her.',
  'show_memory', 'S1E05'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Ms. Li wanted me to be a role model for Lawndale High''s image campaign. I told her my idea of a role model is someone who minds their own business and pays their taxes on time. She didn''t find that "on brand." So I suggested a mascot: a giant question mark.',
  'show_memory', 'S1E06'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Babysitting. Three kids, one hyperactive dog, and a television that only played children''s programming on repeat. I now understand why some species eat their young. The dog was the smartest one in the room. He escaped through a window.',
  'show_memory', 'S1E08'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Road trip with my family. Three hundred miles of staring at my sister''s hair and listening to my dad''s "interesting" music selections. I now know every word to every Eagles song ever recorded. I''d like my therapy bill sent directly to Mom and Dad.',
  'show_memory', 'S1E11'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'After Tommy Sherman died, everyone expected me to be devastated. I barely knew the guy. But apparently grief is contagious at Lawndale High, like a really boring cold. People kept asking if I was "okay." I was the same amount of okay I''ve always been.',
  'show_memory', 'S1E13'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Jane''s art project got censored for being "too political." The school paper called it "controversial." I called it "accurate." The mural was painted over in beige. Very brave statement from the administration. Beige: the color of surrender.',
  'show_memory', 'S2E01'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Remember when my parents renewed their vows and almost got divorced in the same weekend? It was like watching a nature documentary about the mating habits of upper-middle-class suburbanites. At one point I hid in the coat closet with a book. Best hour of the trip.',
  'show_memory', 'S2E04'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Jane tried out for the track team. She said it was about "personal growth." I said it was about wearing shorts in public. She ran. She fell. She got back up. I gave her a 7.5 for artistic impression. The mud stain on her uniform was particularly expressive.',
  'show_memory', 'S2E11'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Trent''s band Mystik Spiral practiced in the garage for six hours. They played the same twelve notes in different orders. I think I heard a melody around hour four, but it might have been oxygen deprivation. Jane says that''s their best session yet.',
  'show_memory', 'S3E05'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'I remember the day Quinn discovered philosophy. She asked me what the meaning of life was. I said "trying to get through a day without hearing the word ''whatever'' used as a complete sentence." She didn''t get it. She said "whatever" and walked away. The irony was exquisite.',
  'show_memory', 'S4E07'
);

INSERT INTO public.daria_social_entries (content, category, source_episode) VALUES
(
  'Graduation. Four years of Lawndale High compressed into a two-hour ceremony. Ms. Li gave a speech about "bright futures." I looked around the room and saw mostly confused teenagers wondering if adult life comes with a manual. Spoiler: it doesn''t. But at least the pizza afterward was adequate.',
  'show_memory', 'S5E11'
);

-- ============================================================
-- LATE NIGHT THOUGHTS (5 entries)
-- ============================================================

INSERT INTO public.daria_social_entries (content, category) VALUES
(
  '11 PM thought: If enthusiasm burned calories, pep rallies would solve the obesity crisis. Instead they just make everyone dumber simultaneously. I''d rather be fit and smart, but apparently that''s too much to ask from the American education system.',
  'late_night'
);

INSERT INTO public.daria_social_entries (content, category) VALUES
(
  '12:47 AM and I''m wondering why people say "sleep on it" as if the night will magically solve your problems. I''ve slept on many things. The problem is still there in the morning, just with pillow creases on its face.',
  'late_night'
);

INSERT INTO public.daria_social_entries (content, category) VALUES
(
  'It''s 2 AM and I just finished a book about existential dread. Light reading. The protagonist spent 200 pages staring at a wall. I felt seen. Jane says I should read something "uplifting" for once. Clearly she doesn''t understand my brand.',
  'late_night'
);

INSERT INTO public.daria_social_entries (content, category) VALUES
(
  '3 AM revelation: The reason I can''t sleep is that my brain has decided 3 AM is the optimal time to replay every embarrassing thing I''ve said since 1992. Thanks, brain. I was wondering what made me cringe in 8th grade Spanish class.',
  'late_night'
);

INSERT INTO public.daria_social_entries (content, category) VALUES
(
  '1 AM. Still awake. Ran out of books. Ran out of interesting ceiling cracks. Briefly considered writing poetry. My self-respect intervened. Now I''m counting the number of times Quinn has said "like" in her sleep. Current record: 47 per hour. I''m genuinely impressed.',
  'late_night'
);
