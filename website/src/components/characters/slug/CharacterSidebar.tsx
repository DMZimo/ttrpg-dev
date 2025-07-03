import React from "react";
import type { Character } from "@/types/characterTypes";
import {
  getTotalLevel,
  getLanguagesDisplay,
  getAbilityModifier,
  formatAbilityModifier,
} from "@/utils/characterUtils";

interface CharacterSidebarProps {
  character: Character;
}

export const CharacterSidebar: React.FC<CharacterSidebarProps> = ({
  character,
}) => {
  const { data } = character;

  const totalLevel = getTotalLevel(data.classes || data.class);
  const languagesDisplay = getLanguagesDisplay(data.languages);

  // Check if character has traits
  const hasTraits =
    data.personality_traits || data.ideals || data.bonds || data.flaws;

  return (
    <div className="h-full pt-16 overflow-y-auto">
      <div className="bg-surface-elevated border border-border-secondary rounded-lg p-4 m-0">
        {/* Basic Stats */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-text-primary mb-2">
            Details
          </h4>
          <div className="flex flex-col gap-1.5">
            {data.background && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-text-secondary">
                  Background:
                </span>
                <span className="text-xs text-text-primary break-words">
                  {data.background}
                </span>
              </div>
            )}

            {data.birthplace && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-text-secondary">
                  Birthplace:
                </span>
                <span className="text-xs text-text-primary break-words">
                  {data.birthplace}
                </span>
              </div>
            )}

            {data.culture && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-text-secondary">
                  Culture:
                </span>
                <span className="text-xs text-text-primary break-words">
                  {data.culture}
                </span>
              </div>
            )}

            {data.size && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-text-secondary">
                  Size:
                </span>
                <span className="text-xs text-text-primary break-words">
                  {data.size}
                </span>
              </div>
            )}

            {languagesDisplay && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-text-secondary">
                  Languages:
                </span>
                <span className="text-xs text-text-primary break-words">
                  {languagesDisplay}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Physical Description */}
        {data.physical_description && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              Physical Description
            </h4>
            <div className="flex flex-col gap-1.5">
              {data.physical_description.gender && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-text-secondary">
                    Gender:
                  </span>
                  <span className="text-xs text-text-primary break-words">
                    {data.physical_description.gender}
                  </span>
                </div>
              )}
              {data.physical_description.hair && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-text-secondary">
                    Hair:
                  </span>
                  <span className="text-xs text-text-primary break-words">
                    {data.physical_description.hair}
                  </span>
                </div>
              )}
              {data.physical_description.eyes && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-text-secondary">
                    Eyes:
                  </span>
                  <span className="text-xs text-text-primary break-words">
                    {data.physical_description.eyes}
                  </span>
                </div>
              )}
              {data.physical_description.skin && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-text-secondary">
                    Skin:
                  </span>
                  <span className="text-xs text-text-primary break-words">
                    {data.physical_description.skin}
                  </span>
                </div>
              )}
              {data.physical_description.build && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-text-secondary">
                    Build:
                  </span>
                  <span className="text-xs text-text-primary break-words">
                    {data.physical_description.build}
                  </span>
                </div>
              )}
              {data.physical_description.height && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-text-secondary">
                    Height:
                  </span>
                  <span className="text-xs text-text-primary break-words">
                    {data.physical_description.height
                      .map((h, i) => `${h.feet}'${h.inches}"`)
                      .join(", ")}
                  </span>
                </div>
              )}
              {data.physical_description.weight && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-text-secondary">
                    Weight:
                  </span>
                  <span className="text-xs text-text-primary break-words">
                    {data.physical_description.weight}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              Skills
            </h4>
            <div className="flex flex-col gap-1">
              {data.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-1 px-2 bg-surface-secondary rounded border border-border-secondary"
                >
                  <span className="text-xs font-medium text-text-primary">
                    {skill.name}
                  </span>
                  <span className="text-xs font-semibold text-text-secondary">
                    {formatAbilityModifier(skill.modifier)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Skills */}
        {data.other_skills && data.other_skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              Other Skills & Proficiencies
            </h4>
            <div className="space-y-1">
              {data.other_skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-surface-secondary p-1 rounded text-xs text-center"
                >
                  <span className="font-medium">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saving Throws */}
        {data.saving_throws && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              Saving Throws
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(data.saving_throws).map(
                ([ability, modifier]) =>
                  modifier !== undefined && (
                    <div
                      key={ability}
                      className="bg-surface-secondary p-2 rounded border border-border-secondary text-center"
                    >
                      <div className="font-medium text-text-primary text-xs">
                        {ability.toUpperCase()}
                      </div>
                      <div className="text-text-secondary text-xs">
                        {formatAbilityModifier(modifier)}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        )}

        {/* Spellcasting */}
        {data.spellcasting && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              Spellcasting
            </h4>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center py-1 px-2 bg-surface-secondary rounded border border-border-secondary">
                <span className="text-xs font-semibold text-text-secondary">
                  Ability:
                </span>
                <span className="text-xs font-semibold text-text-primary">
                  {data.spellcasting.ability.toUpperCase()}
                </span>
              </div>
              {data.spellcasting.spell_attack_bonus && (
                <div className="flex justify-between items-center py-1 px-2 bg-surface-secondary rounded border border-border-secondary">
                  <span className="text-xs font-semibold text-text-secondary">
                    Attack Bonus:
                  </span>
                  <span className="text-xs font-semibold text-text-primary">
                    {formatAbilityModifier(
                      data.spellcasting.spell_attack_bonus
                    )}
                  </span>
                </div>
              )}
              {data.spellcasting.spell_save_dc && (
                <div className="flex justify-between items-center py-1 px-2 bg-surface-secondary rounded border border-border-secondary">
                  <span className="text-xs font-semibold text-text-secondary">
                    Save DC:
                  </span>
                  <span className="text-xs font-semibold text-text-primary">
                    {data.spellcasting.spell_save_dc}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Affiliations */}
        {(data.enclave ||
          data.organization ||
          data.affiliations ||
          data.cult) && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              Affiliations
            </h4>
            <div className="flex flex-col gap-1">
              {data.enclave && (
                <div className="flex flex-col gap-0.5 py-1 px-2 bg-surface-secondary rounded border border-border-secondary">
                  <span className="text-xs font-semibold text-text-secondary">
                    Enclave:
                  </span>
                  <span className="text-xs text-text-primary">
                    {data.enclave.name}
                  </span>
                </div>
              )}
              {data.organization && (
                <div className="flex flex-col gap-0.5 py-1 px-2 bg-surface-secondary rounded border border-border-secondary">
                  <span className="text-xs font-semibold text-text-secondary">
                    Organization:
                  </span>
                  <span className="text-xs text-text-primary">
                    {data.organization.name}
                  </span>
                </div>
              )}
              {data.cult && (
                <div className="flex flex-col gap-0.5 py-1 px-2 bg-surface-secondary rounded border border-border-secondary">
                  <span className="text-xs font-semibold text-text-secondary">
                    Cult:
                  </span>
                  <span className="text-xs text-text-primary">
                    {data.cult.name}
                  </span>
                </div>
              )}
              {data.affiliations &&
                data.affiliations.map((affiliation, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-0.5 py-1 px-2 bg-surface-secondary rounded border border-border-secondary"
                  >
                    <span className="text-xs font-semibold text-text-secondary">
                      Affiliation:
                    </span>
                    <span className="text-xs text-text-primary">
                      {affiliation.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Character Traits Section */}
        {hasTraits && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              Character Traits
            </h4>

            <div className="space-y-3">
              {/* Personality Traits */}
              {data.personality_traits &&
                data.personality_traits.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-text-primary mb-1 flex items-center gap-1">
                      <span className="text-xs">🎭</span>
                      Personality Traits
                    </h5>
                    <div className="space-y-1">
                      {data.personality_traits.map((trait, index) => (
                        <div
                          key={index}
                          className="bg-surface-secondary p-1 rounded text-xs"
                        >
                          {trait}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Ideals */}
              {data.ideals && data.ideals.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-text-primary mb-1 flex items-center gap-1">
                    <span className="text-xs">⭐</span>
                    Ideals
                  </h5>
                  <div className="space-y-1">
                    {data.ideals.map((ideal, index) => (
                      <div
                        key={index}
                        className="bg-surface-secondary p-1 rounded text-xs"
                      >
                        {ideal}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bonds */}
              {data.bonds && data.bonds.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-text-primary mb-1 flex items-center gap-1">
                    <span className="text-xs">🤝</span>
                    Bonds
                  </h5>
                  <div className="space-y-1">
                    {data.bonds.map((bond, index) => (
                      <div
                        key={index}
                        className="bg-surface-secondary p-1 rounded text-xs"
                      >
                        {bond}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Flaws */}
              {data.flaws && data.flaws.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-text-primary mb-1 flex items-center gap-1">
                    <span className="text-xs">⚠️</span>
                    Flaws
                  </h5>
                  <div className="space-y-1">
                    {data.flaws.map((flaw, index) => (
                      <div
                        key={index}
                        className="bg-surface-secondary p-1 rounded text-xs"
                      >
                        {flaw}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allies and Enemies */}
              {(data.allies || data.enemies) && (
                <div>
                  <h5 className="text-sm font-medium text-text-primary mb-1">
                    Relationships
                  </h5>
                  <div className="space-y-2">
                    {/* Allies */}
                    {data.allies && data.allies.length > 0 && (
                      <div>
                        <h6 className="text-xs font-medium text-text-primary mb-1 flex items-center gap-1">
                          <span className="text-green-500">🤝</span>
                          Allies
                        </h6>
                        <div className="space-y-1">
                          {data.allies.map((ally, index) => (
                            <div
                              key={index}
                              className="bg-surface-secondary p-1 rounded text-xs"
                            >
                              {ally}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enemies */}
                    {data.enemies && data.enemies.length > 0 && (
                      <div>
                        <h6 className="text-xs font-medium text-text-primary mb-1 flex items-center gap-1">
                          <span className="text-red-500">⚔️</span>
                          Enemies
                        </h6>
                        <div className="space-y-1">
                          {data.enemies.map((enemy, index) => (
                            <div
                              key={index}
                              className="bg-surface-secondary p-1 rounded text-xs"
                            >
                              {enemy}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
