import {
  Upload,
  Plus,
  X,
  Eye,
  EyeOff,
  Trash2,
  ArrowUp,
  ArrowDown,
  Link,
  GripVertical,
} from "lucide-react";
import { useEffect } from "react";
import api from "../services/api";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { TextArea } from "./ui/TextArea";
import { Select } from "./ui/Select";
import { SectionHeader } from "./ui/SectionHeader";
import {
  CvData,
  Experience,
  Education,
  Skill,
  Language,
  CustomSectionItem,
  CustomField,
  PersonalInfo,
} from "../types/cv";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface EditorProps {
  cvData: CvData;
  setCvData: (data: CvData) => void;
  currentTemplate: string;
}

// Sortable item component for drag-and-drop
interface SortableItemProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative">
      <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
        <div className="flex items-center gap-2 flex-1">
          {/* Drag handle */}
          <button
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical size={20} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Editor({
  cvData,
  setCvData,
  currentTemplate,
}: EditorProps) {
  const toggleVisibility = (section: string) => {
    setCvData({
      ...cvData,
      visibility: {
        ...cvData.visibility,
        [section]: !cvData.visibility[section],
      },
    });
  };

  // Ensure visibility keys exist (migration for existing CVs)
  useEffect(() => {
    if (
      cvData.visibility &&
      (cvData.visibility.personalInfo === undefined ||
        cvData.visibility.summary === undefined)
    ) {
      setCvData({
        ...cvData,
        visibility: {
          ...cvData.visibility,
          personalInfo: cvData.visibility.personalInfo ?? true,
          summary: cvData.visibility.summary ?? true,
        },
      });
    }
  }, [cvData.visibility]);

  // Initialize section order if not present
  if (!cvData.sectionOrder) {
  }

  // Ensure sectionOrder contains all visibility keys (migration for existing CVs)
  useEffect(() => {
    if (cvData.sectionOrder) {
      const allKeys = Object.keys(cvData.visibility);
      const missingKeys = allKeys.filter(
        (key) => !cvData.sectionOrder?.includes(key)
      );

      if (missingKeys.length > 0) {
        setCvData({
          ...cvData,
          sectionOrder: [...cvData.sectionOrder, ...missingKeys],
        });
      }
    }
  }, [cvData.visibility, cvData.sectionOrder]);

  // Ensure sectionOrder is initialized in the parent or on load.
  // For now, let's assume we handle it by checking if it exists in the render loop.

  // Set up drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const currentOrder =
        cvData.sectionOrder || Object.keys(cvData.visibility);
      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);

      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);

      setCvData({
        ...cvData,
        sectionOrder: newOrder,
      });
    }
  };

  const moveSection = (index: number, direction: number) => {
    const currentOrder = cvData.sectionOrder || Object.keys(cvData.visibility);
    const newOrder = [...currentOrder];

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newOrder.length) return;

    [newOrder[index], newOrder[newIndex]] = [
      newOrder[newIndex],
      newOrder[index],
    ];

    setCvData({
      ...cvData,
      sectionOrder: newOrder,
    });
  };

  // Reorder helper functions for sub-items
  const reorderEducation = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cvData.education.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = cvData.education.findIndex(
        (item) => item.id === over.id
      );
      setCvData({
        ...cvData,
        education: arrayMove(cvData.education, oldIndex, newIndex),
      });
    }
  };

  const reorderExperience = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cvData.experience.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = cvData.experience.findIndex(
        (item) => item.id === over.id
      );
      setCvData({
        ...cvData,
        experience: arrayMove(cvData.experience, oldIndex, newIndex),
      });
    }
  };

  const reorderSkills = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cvData.skills.findIndex((item) => item.id === active.id);
      const newIndex = cvData.skills.findIndex((item) => item.id === over.id);
      setCvData({
        ...cvData,
        skills: arrayMove(cvData.skills, oldIndex, newIndex),
      });
    }
  };

  const reorderLanguages = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && cvData.languages) {
      const oldIndex = cvData.languages.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = cvData.languages.findIndex(
        (item) => item.id === over.id
      );
      setCvData({
        ...cvData,
        languages: arrayMove(cvData.languages, oldIndex, newIndex),
      });
    }
  };

  const reorderInterests = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && cvData.interests) {
      const oldIndex = cvData.interests.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = cvData.interests.findIndex(
        (item) => item.id === over.id
      );
      setCvData({
        ...cvData,
        interests: arrayMove(cvData.interests, oldIndex, newIndex),
      });
    }
  };

  const reorderCustomFields = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && cvData.personalInfo.customFields) {
      const oldIndex = cvData.personalInfo.customFields.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = cvData.personalInfo.customFields.findIndex(
        (item) => item.id === over.id
      );
      const reordered = arrayMove(
        cvData.personalInfo.customFields,
        oldIndex,
        newIndex
      );
      setCvData({
        ...cvData,
        personalInfo: { ...cvData.personalInfo, customFields: reordered },
      });
    }
  };

  const reorderCustomSectionItems = (
    event: DragEndEvent,
    sectionId: number
  ) => {
    const { active, over } = event;
    const section = cvData.customSections?.find((s) => s.id === sectionId);

    if (over && section && active.id !== over.id) {
      const oldIndex = section.items.findIndex((item) => item.id === active.id);
      const newIndex = section.items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(section.items, oldIndex, newIndex);

      setCvData({
        ...cvData,
        customSections: cvData.customSections?.map((s) =>
          s.id === sectionId ? { ...s, items: newItems } : s
        ),
      });
    }
  };

  // Helper to check if template supports skill levels
  const supportsSkillLevels = [
    "midnight",
    "slate",
    "azure",
    "aurora",
    "polygonal",
    "verde",
    "orbit",
  ].includes(currentTemplate);

  // Custom Sections Logic
  const addCustomSection = () => {
    setCvData({
      ...cvData,
      customSections: [
        ...(cvData.customSections || []),
        { id: Date.now(), title: "New Section", items: [] },
      ],
    });
  };

  const removeCustomSection = (sectionId: number) => {
    setCvData({
      ...cvData,
      customSections: (cvData.customSections || []).filter(
        (s) => s.id !== sectionId
      ),
    });
  };

  const updateCustomSectionTitle = (sectionId: number, title: string) => {
    setCvData({
      ...cvData,
      customSections: (cvData.customSections || []).map((s) =>
        s.id === sectionId ? { ...s, title } : s
      ),
    });
  };

  const addCustomSectionItem = (sectionId: number) => {
    setCvData({
      ...cvData,
      customSections: (cvData.customSections || []).map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: [
                ...s.items,
                {
                  id: Date.now(),
                  title: "",
                  subtitle: "",
                  date: "",
                  description: "",
                },
              ],
            }
          : s
      ),
    });
  };

  const updateCustomSectionItem = (
    sectionId: number,
    itemId: number,
    field: keyof CustomSectionItem,
    value: string
  ) => {
    setCvData({
      ...cvData,
      customSections: (cvData.customSections || []).map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((i) =>
                i.id === itemId ? { ...i, [field]: value } : i
              ),
            }
          : s
      ),
    });
  };

  const removeCustomSectionItem = (sectionId: number, itemId: number) => {
    setCvData({
      ...cvData,
      customSections: (cvData.customSections || []).map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.filter((i) => i.id !== itemId),
            }
          : s
      ),
    });
  };
  const handlePersonalInfoChange = (
    field: keyof Omit<PersonalInfo, "customFields">,
    value: string
  ) => {
    setCvData({
      ...cvData,
      personalInfo: { ...cvData.personalInfo, [field]: value },
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (cvData.id) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          await api.uploadPhoto(cvData.id, formData);

          // Update photo URL with timestamp to force refresh
          const photoUrl = `http://localhost:5140/api/cv/${
            cvData.id
          }/photo?t=${new Date().getTime()}`;
          handlePersonalInfoChange("photo", photoUrl);

          console.log("Photo uploaded to database successfully");
        } catch (error) {
          console.error("Failed to upload photo to database", error);
        }
      } else {
        console.warn("Cannot upload photo: CV ID is missing (new CV?)");
        // Fallback for new CVs (unsaved) - we might still need base64 temporary,
        // OR warn user they must save first.
        // For now, let's keep the user experience smooth but maybe just alert if saving is needed.
        // Actually, if it's a new CV, we can't upload to an ID that doesn't exist.
        // Let's assume the user saves first or we just don't handle photo for unsaved CVs yet.
        // But the previous code had base64 as fallback.
        // To strictly follow "remove base64", we can't use it.
        // But for UX, if I remove it, they can't see the photo on a new CV until they save.
        // I will stick to the plan: Remove Base64.
        alert("Please save the CV first before uploading a photo.");
      }
    }
  };

  const addExperience = () => {
    setCvData({
      ...cvData,
      experience: [
        ...cvData.experience,
        {
          id: Date.now(),
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const updateExperience = (
    id: number,
    field: keyof Experience,
    value: string
  ) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: number) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: Date.now(),
          degree: "",
          school: "",
          location: "",
          startDate: "",
          endDate: "",
          gpa: "",
        },
      ],
    });
  };

  const updateEducation = (
    id: number,
    field: keyof Education,
    value: string
  ) => {
    setCvData({
      ...cvData,
      education: cvData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: number) => {
    setCvData({
      ...cvData,
      education: cvData.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkill = () => {
    setCvData({
      ...cvData,
      skills: [
        ...cvData.skills,
        { id: Date.now(), name: "", level: 75, showLevel: true },
      ],
    });
  };

  const updateSkill = (
    id: number,
    field: keyof Skill,
    value: string | number | boolean
  ) => {
    setCvData({
      ...cvData,
      skills: cvData.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkill = (id: number) => {
    setCvData({
      ...cvData,
      skills: cvData.skills.filter((skill) => skill.id !== id),
    });
  };

  // Interests
  const addInterest = () => {
    setCvData({
      ...cvData,
      interests: [...(cvData.interests || []), { id: Date.now(), name: "" }],
    });
  };

  const updateInterest = (id: number, value: string) => {
    setCvData({
      ...cvData,
      interests: (cvData.interests || []).map((int) =>
        int.id === id ? { ...int, name: value } : int
      ),
    });
  };

  const removeInterest = (id: number) => {
    setCvData({
      ...cvData,
      interests: (cvData.interests || []).filter((int) => int.id !== id),
    });
  };

  // Languages
  const addLanguage = () => {
    setCvData({
      ...cvData,
      languages: [
        ...(cvData.languages || []),
        { id: Date.now(), name: "", proficiency: "Novice/Beginner (A1)" },
      ],
    });
  };

  const updateLanguage = (id: number, field: keyof Language, value: string) => {
    setCvData({
      ...cvData,
      languages: (cvData.languages || []).map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    });
  };

  const removeLanguage = (id: number) => {
    setCvData({
      ...cvData,
      languages: (cvData.languages || []).filter((lang) => lang.id !== id),
    });
  };

  // Custom Fields
  const addCustomField = () => {
    setCvData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        customFields: [
          ...(cvData.personalInfo.customFields || []),
          { id: Date.now().toString(), label: "", value: "", isUrl: false },
        ],
      },
    });
  };

  const updateCustomField = (
    id: string,
    field: keyof CustomField,
    value: string | boolean
  ) => {
    setCvData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        customFields: (cvData.personalInfo.customFields || []).map((cf) =>
          cf.id === id ? { ...cf, [field]: value } : cf
        ),
      },
    });
  };

  const removeCustomField = (id: string) => {
    setCvData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        customFields: (cvData.personalInfo.customFields || []).filter(
          (cf) => cf.id !== id
        ),
      },
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
      {/* Section Visibility and Reordering Control */}
      <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Section Visibility & Order
        </h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={cvData.sectionOrder || Object.keys(cvData.visibility)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {(cvData.sectionOrder || Object.keys(cvData.visibility)).map(
                (key, index) => {
                  // Ensure key exists in visibility (handle potential stale keys in order)
                  if (cvData.visibility[key] === undefined) return null;

                  return (
                    <SortableItem key={key} id={key}>
                      <Button
                        onClick={() => toggleVisibility(key)}
                        variant="ghost"
                        icon={cvData.visibility[key] ? Eye : EyeOff}
                        className={
                          cvData.visibility[key]
                            ? "text-blue-600"
                            : "text-gray-400"
                        }
                      />
                      <span className="capitalize font-medium text-gray-700">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <div className="flex items-center gap-1 ml-auto">
                        <Button
                          onClick={() => moveSection(index, -1)}
                          variant="ghost"
                          icon={ArrowUp}
                          disabled={index === 0}
                          className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                        />
                        <Button
                          onClick={() => moveSection(index, 1)}
                          variant="ghost"
                          icon={ArrowDown}
                          disabled={
                            index ===
                            (
                              cvData.sectionOrder ||
                              Object.keys(cvData.visibility)
                            ).length -
                              1
                          }
                          className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                        />
                      </div>
                    </SortableItem>
                  );
                }
              )}
            </div>
          </SortableContext>
        </DndContext>
      </section>

      {/* Personal Info Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
          Personal Information
        </h2>

        {/* Photo Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            {cvData.personalInfo.photo ? (
              <>
                <img
                  src={cvData.personalInfo.photo}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                />
                <Button
                  onClick={() => handlePersonalInfoChange("photo", "")}
                  variant="danger"
                  icon={X}
                >
                  Remove Photo
                </Button>
              </>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-gray-400">
                <Upload size={24} />
              </div>
            )}
            <div>
              <Button
                as="label"
                htmlFor="photo-upload"
                variant="primary"
                color="blue"
                icon={Upload}
                className="cursor-pointer"
              >
                Upload Photo
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Input
            placeholder="Full Name"
            value={cvData.personalInfo.fullName}
            onChange={(e) =>
              handlePersonalInfoChange("fullName", e.target.value)
            }
            color="blue"
          />
          <Input
            placeholder="Professional Title"
            value={cvData.personalInfo.title}
            onChange={(e) => handlePersonalInfoChange("title", e.target.value)}
            color="blue"
          />
          <Input
            type="email"
            placeholder="Email"
            value={cvData.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
            color="blue"
          />
          <Input
            type="tel"
            placeholder="Phone"
            value={cvData.personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
            color="blue"
          />
          <Input
            placeholder="Location"
            value={cvData.personalInfo.location}
            onChange={(e) =>
              handlePersonalInfoChange("location", e.target.value)
            }
            color="blue"
          />
          <Input
            placeholder="Website"
            value={cvData.personalInfo.website || ""}
            onChange={(e) =>
              handlePersonalInfoChange("website", e.target.value)
            }
            color="blue"
          />
          <TextArea
            placeholder="Professional Summary"
            value={cvData.personalInfo.summary}
            onChange={(e) =>
              handlePersonalInfoChange("summary", e.target.value)
            }
            rows={4}
            color="blue"
          />

          {/* Custom Fields */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Custom Fields
              </label>
              <Button
                onClick={addCustomField}
                variant="text"
                color="blue"
                icon={Plus}
                iconSize={14}
              >
                Add Field
              </Button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={reorderCustomFields}
            >
              <SortableContext
                items={(cvData.personalInfo.customFields || []).map(
                  (f) => f.id
                )}
                strategy={verticalListSortingStrategy}
              >
                {(cvData.personalInfo.customFields || []).map((field) => (
                  <SortableItem key={field.id} id={field.id}>
                    <div className="flex gap-2 items-center flex-1">
                      <Input
                        placeholder="Label (e.g. LinkedIn)"
                        value={field.label}
                        onChange={(e) =>
                          updateCustomField(field.id, "label", e.target.value)
                        }
                        color="blue"
                        className="w-1/3"
                      />
                      <Input
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) =>
                          updateCustomField(field.id, "value", e.target.value)
                        }
                        color="blue"
                        className="flex-1"
                      />
                      <Button
                        onClick={() =>
                          updateCustomField(field.id, "isUrl", !field.isUrl)
                        }
                        variant="ghost"
                        icon={Link}
                        title={field.isUrl ? "Unlink" : "Make URL"}
                        className={
                          field.isUrl ? "text-blue-500" : "text-gray-400"
                        }
                      />
                      <Button
                        onClick={() => removeCustomField(field.id)}
                        variant="ghost"
                        icon={X}
                      />
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      {cvData.visibility?.experience && (
        <section>
          <SectionHeader
            title="Experience"
            color="green"
            onAdd={addExperience}
            addButtonLabel="Add Experience"
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={reorderExperience}
          >
            <SortableContext
              items={cvData.experience.map((exp) => exp.id)}
              strategy={verticalListSortingStrategy}
            >
              {cvData.experience.map((exp) => (
                <SortableItem key={exp.id} id={exp.id}>
                  <div className="flex-1">
                    <Button
                      onClick={() => removeExperience(exp.id)}
                      variant="ghost"
                      icon={X}
                      className="float-right"
                    />
                    <div className="grid grid-cols-1 gap-3 pr-8">
                      <Input
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) =>
                          updateExperience(exp.id, "title", e.target.value)
                        }
                        color="green"
                      />
                      <Input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, "company", e.target.value)
                        }
                        color="green"
                      />
                      <Input
                        placeholder="Location"
                        value={exp.location}
                        onChange={(e) =>
                          updateExperience(exp.id, "location", e.target.value)
                        }
                        color="green"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="month"
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(
                              exp.id,
                              "startDate",
                              e.target.value
                            )
                          }
                          color="green"
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="End Date"
                            value={exp.endDate === "Ongoing" ? "" : exp.endDate}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "endDate",
                                e.target.value
                              )
                            }
                            color="green"
                            type={exp.endDate === "Ongoing" ? "text" : "month"}
                            disabled={exp.endDate === "Ongoing"}
                            className="flex-1"
                          />
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={exp.endDate === "Ongoing"}
                              onChange={(e) => {
                                updateExperience(
                                  exp.id,
                                  "endDate",
                                  e.target.checked ? "Ongoing" : ""
                                );
                              }}
                              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                              id={`ongoing-exp-${exp.id}`}
                            />
                            <label
                              htmlFor={`ongoing-exp-${exp.id}`}
                              className="ml-2 text-sm font-medium text-gray-900"
                            >
                              Ongoing
                            </label>
                          </div>
                        </div>
                      </div>
                      <TextArea
                        placeholder="Job Description"
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(
                            exp.id,
                            "description",
                            e.target.value
                          )
                        }
                        rows={3}
                        color="green"
                      />
                    </div>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </section>
      )}

      {/* Education Section */}
      {cvData.visibility?.education && (
        <section>
          <SectionHeader
            title="Education"
            color="purple"
            onAdd={addEducation}
            addButtonLabel="Add Education"
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={reorderEducation}
          >
            <SortableContext
              items={cvData.education.map((edu) => edu.id)}
              strategy={verticalListSortingStrategy}
            >
              {cvData.education.map((edu) => (
                <SortableItem key={edu.id} id={edu.id}>
                  <div className="flex-1">
                    <Button
                      onClick={() => removeEducation(edu.id)}
                      variant="ghost"
                      icon={X}
                      className="float-right"
                    />
                    <div className="grid grid-cols-1 gap-3 pr-8">
                      <Input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, "degree", e.target.value)
                        }
                        color="purple"
                      />
                      <Input
                        placeholder="School/University"
                        value={edu.school}
                        onChange={(e) =>
                          updateEducation(edu.id, "school", e.target.value)
                        }
                        color="purple"
                      />
                      <Input
                        placeholder="Location"
                        value={edu.location}
                        onChange={(e) =>
                          updateEducation(edu.id, "location", e.target.value)
                        }
                        color="purple"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="month"
                          placeholder="Start Date"
                          value={edu.startDate}
                          onChange={(e) =>
                            updateEducation(edu.id, "startDate", e.target.value)
                          }
                          color="purple"
                        />
                        <div className="flex gap-2">
                          <Input
                            type={edu.endDate === "Ongoing" ? "text" : "month"}
                            placeholder="End Date"
                            value={edu.endDate === "Ongoing" ? "" : edu.endDate}
                            onChange={(e) =>
                              updateEducation(edu.id, "endDate", e.target.value)
                            }
                            color="purple"
                            disabled={edu.endDate === "Ongoing"}
                            className="flex-1"
                          />
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={edu.endDate === "Ongoing"}
                              onChange={(e) => {
                                updateEducation(
                                  edu.id,
                                  "endDate",
                                  e.target.checked ? "Ongoing" : ""
                                );
                              }}
                              className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                              id={`ongoing-edu-${edu.id}`}
                            />
                            <label
                              htmlFor={`ongoing-edu-${edu.id}`}
                              className="ml-2 text-sm font-medium text-gray-900"
                            >
                              Ongoing
                            </label>
                          </div>
                        </div>
                      </div>
                      <Input
                        placeholder="GPA (optional)"
                        value={edu.gpa}
                        onChange={(e) =>
                          updateEducation(edu.id, "gpa", e.target.value)
                        }
                        color="purple"
                      />
                    </div>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </section>
      )}

      {/* Skills Section */}
      {cvData.visibility?.skills && (
        <section>
          <SectionHeader
            title="Skills"
            color="orange"
            onAdd={addSkill}
            addButtonLabel="Add Skill"
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={reorderSkills}
          >
            <SortableContext
              items={cvData.skills.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cvData.skills.map((skill) => (
                  <SortableItem key={skill.id} id={skill.id}>
                    <div className="flex flex-col gap-2 p-1 w-full relative">
                      <Button
                        onClick={() => removeSkill(skill.id)}
                        variant="ghost"
                        icon={X}
                        className="absolute top-0 right-0"
                      />
                      <div className="pr-8">
                        <Input
                          placeholder="Skill Name"
                          value={skill.name}
                          onChange={(e) =>
                            updateSkill(skill.id, "name", e.target.value)
                          }
                          color="orange"
                          className="mb-2"
                        />
                      </div>

                      {supportsSkillLevels && (
                        <div className="flex items-center gap-3">
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-12">
                              Level: {skill.level || 75}%
                            </span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.level || 75}
                              onChange={(e) =>
                                updateSkill(
                                  skill.id,
                                  "level",
                                  parseInt(e.target.value)
                                )
                              }
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                              disabled={skill.showLevel === false}
                            />
                          </div>
                          <Button
                            onClick={() =>
                              updateSkill(
                                skill.id,
                                "showLevel",
                                !skill.showLevel
                              )
                            }
                            variant="ghost"
                            icon={skill.showLevel !== false ? Eye : EyeOff}
                            title={
                              skill.showLevel !== false
                                ? "Hide Level"
                                : "Show Level"
                            }
                            className={
                              skill.showLevel === false
                                ? "text-gray-400"
                                : "text-orange-500"
                            }
                          />
                        </div>
                      )}
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      )}

      {/* Interests Section */}
      {cvData.visibility?.interests && (
        <section>
          <SectionHeader
            title="Interests"
            color="pink"
            onAdd={addInterest}
            addButtonLabel="Add Interest"
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={reorderInterests}
          >
            <SortableContext
              items={(cvData.interests || []).map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(cvData.interests || []).map((interest) => (
                  <SortableItem key={interest.id} id={interest.id}>
                    <div className="flex gap-2 items-center flex-1">
                      <Input
                        placeholder="Interest"
                        value={interest.name}
                        onChange={(e) =>
                          updateInterest(interest.id, e.target.value)
                        }
                        color="pink"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => removeInterest(interest.id)}
                        variant="ghost"
                        icon={X}
                      />
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      )}

      {/* Languages Section */}
      {cvData.visibility?.languages && (
        <section>
          <SectionHeader
            title="Languages"
            color="teal"
            onAdd={addLanguage}
            addButtonLabel="Add Language"
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={reorderLanguages}
          >
            <SortableContext
              items={(cvData.languages || []).map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {(cvData.languages || []).map((lang) => (
                  <SortableItem key={lang.id} id={lang.id}>
                    <div className="flex gap-2 items-center flex-1">
                      <Input
                        placeholder="Language"
                        value={lang.name}
                        onChange={(e) =>
                          updateLanguage(lang.id, "name", e.target.value)
                        }
                        color="teal"
                        className="flex-1"
                      />
                      <Select
                        placeholder="Proficiency"
                        value={lang.proficiency}
                        onChange={(e) =>
                          updateLanguage(lang.id, "proficiency", e.target.value)
                        }
                        options={[
                          {
                            value: "Novice/Beginner (A1)",
                            label: "Novice/Beginner (A1)",
                          },
                          {
                            value: "Intermediate (B1)",
                            label: "Intermediate (B1)",
                          },
                          { value: "Advanced (C1)", label: "Advanced (C1)" },
                          { value: "Fluent", label: "Fluent" },
                          { value: "Native", label: "Native" },
                        ]}
                        color="teal"
                        className="w-1/3"
                      />
                      <Button
                        onClick={() => removeLanguage(lang.id)}
                        variant="ghost"
                        icon={X}
                      />
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      )}

      {/* Custom Sections */}
      {cvData.visibility?.customSections && (
        <section>
          <SectionHeader
            title="Custom Sections"
            color="indigo"
            onAdd={addCustomSection}
            addButtonLabel="Add Section"
          />

          <div className="space-y-6">
            {(cvData.customSections || []).map((section) => (
              <div
                key={section.id}
                className="border border-gray-300 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      updateCustomSectionTitle(section.id, e.target.value)
                    }
                    className="text-lg font-bold bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none px-1"
                    placeholder="Section Title"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addCustomSectionItem(section.id)}
                      variant="text"
                      color="indigo"
                      icon={Plus}
                      iconSize={14}
                    >
                      Add Item
                    </Button>
                    <Button
                      onClick={() => removeCustomSection(section.id)}
                      variant="ghost"
                      icon={Trash2}
                    />
                  </div>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => reorderCustomSectionItems(e, section.id)}
                >
                  <SortableContext
                    items={section.items.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {section.items.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                          <div className="grid grid-cols-1 gap-3 p-1 w-full relative">
                            <Button
                              onClick={() =>
                                removeCustomSectionItem(section.id, item.id)
                              }
                              variant="ghost"
                              icon={X}
                              iconSize={16}
                              className="absolute top-0 right-0"
                            />
                            <Input
                              placeholder="Title / Role"
                              value={item.title}
                              onChange={(e) =>
                                updateCustomSectionItem(
                                  section.id,
                                  item.id,
                                  "title",
                                  e.target.value
                                )
                              }
                              color="indigo"
                              className="text-sm pr-8"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="Subtitle / Company"
                                value={item.subtitle}
                                onChange={(e) =>
                                  updateCustomSectionItem(
                                    section.id,
                                    item.id,
                                    "subtitle",
                                    e.target.value
                                  )
                                }
                                color="indigo"
                                className="text-sm"
                              />
                              <Input
                                placeholder="Date / Duration"
                                value={item.date}
                                onChange={(e) =>
                                  updateCustomSectionItem(
                                    section.id,
                                    item.id,
                                    "date",
                                    e.target.value
                                  )
                                }
                                color="indigo"
                                className="text-sm"
                              />
                            </div>
                            <TextArea
                              placeholder="Description"
                              value={item.description}
                              onChange={(e) =>
                                updateCustomSectionItem(
                                  section.id,
                                  item.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={2}
                              color="indigo"
                              className="text-sm"
                            />
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
