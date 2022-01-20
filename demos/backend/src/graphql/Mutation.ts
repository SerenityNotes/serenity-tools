import { objectType, inputObjectType, arg, mutationField } from "nexus";
import { createOrganization as createOrganizationDb } from "../database/createOrganization";
import { createUser as createUserDb } from "../database/createUser";
import { addMemberToOrganization as addMemberToOrganizationDb } from "../database/addMemberToOrganization";
import { removeMemberFromOrganization as removeMemberFromOrganizationDb } from "../database/removeMemberFromOrganization";
import { updateOrganizationMember as updateOrganizationMemberDb } from "../database/updateOrganizationMember";
import { addEventProposalToOrganization as addEventProposalToOrganizationDb } from "../database/addEventProposalToOrganization";
import { updateOrganizationEventProposal as updateOrganizationEventProposalDb } from "../database/updateOrganizationEventProposal";
import { deleteOrganizationEventProposal as deleteOrganizationEventProposalDb } from "../database/deleteOrganizationEventProposal";

export const CreateOrganizationInput = inputObjectType({
  name: "CreateOrganizationInput",
  definition(t) {
    t.nonNull.string("event");
    t.nonNull.string("keyId");
    t.nonNull.string("lockboxes");
    t.nonNull.string("encryptedState");
  },
});

export const CreateOrganizationResult = objectType({
  name: "CreateOrganizationResult",
  definition(t) {
    t.boolean("success");
  },
});

export const createOrganization = mutationField("createOrganization", {
  type: CreateOrganizationResult,
  args: {
    input: arg({
      type: CreateOrganizationInput,
    }),
  },
  async resolve(root, args, ctx) {
    await createOrganizationDb(
      JSON.parse(args.input.event),
      args.input.keyId,
      JSON.parse(args.input.lockboxes),
      JSON.parse(args.input.encryptedState)
    );

    return { success: true };
  },
});

export const CreateUserInput = inputObjectType({
  name: "CreateUserInput",
  definition(t) {
    t.nonNull.string("signingPublicKey");
  },
});

export const CreateUserResult = objectType({
  name: "CreateUserResult",
  definition(t) {
    t.boolean("success");
  },
});

export const createUser = mutationField("createUser", {
  type: CreateUserResult,
  args: {
    input: arg({
      type: CreateUserInput,
    }),
  },
  async resolve(root, args, ctx) {
    await createUserDb(args.input.signingPublicKey);
    return { success: true };
  },
});

export const AddMemberToOrganizationInput = inputObjectType({
  name: "AddMemberToOrganizationInput",
  definition(t) {
    t.nonNull.string("organizationId");
    t.nonNull.string("event");
    t.nonNull.string("keyId");
    t.nonNull.string("lockbox");
    t.nonNull.string("encryptedState");
    t.string("eventProposalId");
  },
});

export const AddMemberToOrganizationResult = objectType({
  name: "AddMemberToOrganizationResult",
  definition(t) {
    t.boolean("success");
  },
});

export const addMemberToOrganization = mutationField(
  "addMemberToOrganization",
  {
    type: AddMemberToOrganizationResult,
    args: {
      input: arg({
        type: AddMemberToOrganizationInput,
      }),
    },
    async resolve(root, args, ctx) {
      await addMemberToOrganizationDb(
        args.input.organizationId,
        JSON.parse(args.input.event),
        args.input.keyId,
        JSON.parse(args.input.lockbox),
        JSON.parse(args.input.encryptedState),
        args.input.eventProposalId
      );
      return { success: true };
    },
  }
);

export const RemoveMemberFromOrganizationInput = inputObjectType({
  name: "RemoveMemberFromOrganizationInput",
  definition(t) {
    t.nonNull.string("organizationId");
    t.nonNull.string("event");
    t.nonNull.string("keyId");
    t.nonNull.string("lockboxes");
    t.nonNull.string("encryptedState");
    t.string("eventProposalId");
  },
});

export const RemoveMemberFromOrganizationResult = objectType({
  name: "RemoveMemberFromOrganizationResult",
  definition(t) {
    t.boolean("success");
  },
});

export const removeMemberFromOrganization = mutationField(
  "removeMemberFromOrganization",
  {
    type: RemoveMemberFromOrganizationResult,
    args: {
      input: arg({
        type: RemoveMemberFromOrganizationInput,
      }),
    },
    async resolve(root, args, ctx) {
      await removeMemberFromOrganizationDb(
        args.input.organizationId,
        JSON.parse(args.input.event),
        args.input.keyId,
        JSON.parse(args.input.lockboxes),
        JSON.parse(args.input.encryptedState),
        args.input.eventProposalId
      );
      return { success: true };
    },
  }
);

export const UpdateOrganizationMemberInput = inputObjectType({
  name: "UpdateOrganizationMemberInput",
  definition(t) {
    t.nonNull.string("organizationId");
    t.nonNull.string("event");
    t.string("eventProposalId");
  },
});

export const UpdateOrganizationMemberResult = objectType({
  name: "UpdateOrganizationMemberResult",
  definition(t) {
    t.boolean("success");
  },
});

export const updateOrganizationMember = mutationField(
  "updateOrganizationMember",
  {
    type: UpdateOrganizationMemberResult,
    args: {
      input: arg({
        type: UpdateOrganizationMemberInput,
      }),
    },
    async resolve(root, args, ctx) {
      await updateOrganizationMemberDb(
        args.input.organizationId,
        JSON.parse(args.input.event),
        args.input.eventProposalId
      );
      return { success: true };
    },
  }
);

export const AddEventProposalToOrganizationInput = inputObjectType({
  name: "AddEventProposalToOrganizationInput",
  definition(t) {
    t.nonNull.string("organizationId");
    t.nonNull.string("event");
  },
});

export const AddEventProposalToOrganizationResult = objectType({
  name: "AddEventProposalToOrganizationResult",
  definition(t) {
    t.boolean("success");
  },
});

export const addEventProposalToOrganization = mutationField(
  "addEventProposalToOrganization",
  {
    type: AddEventProposalToOrganizationResult,
    args: {
      input: arg({
        type: AddEventProposalToOrganizationInput,
      }),
    },
    async resolve(root, args, ctx) {
      await addEventProposalToOrganizationDb(
        args.input.organizationId,
        JSON.parse(args.input.event)
      );
      return { success: true };
    },
  }
);

export const UpdateOrganizationEventProposalInput = inputObjectType({
  name: "UpdateOrganizationEventProposalInput",
  definition(t) {
    t.nonNull.string("eventProposalId");
    t.nonNull.string("event");
  },
});

export const UpdateOrganizationEventProposalResult = objectType({
  name: "UpdateOrganizationEventProposalResult",
  definition(t) {
    t.boolean("success");
  },
});

export const updateOrganizationEventProposal = mutationField(
  "updateOrganizationEventProposal",
  {
    type: UpdateOrganizationEventProposalResult,
    args: {
      input: arg({
        type: UpdateOrganizationEventProposalInput,
      }),
    },
    async resolve(root, args, ctx) {
      await updateOrganizationEventProposalDb(
        args.input.eventProposalId,
        JSON.parse(args.input.event)
      );
      return { success: true };
    },
  }
);

export const DeleteOrganizationEventProposalInput = inputObjectType({
  name: "DeleteOrganizationEventProposalInput",
  definition(t) {
    t.nonNull.string("eventProposalId");
  },
});

export const DeleteOrganizationEventProposalResult = objectType({
  name: "DeleteOrganizationEventProposalResult",
  definition(t) {
    t.boolean("success");
  },
});

export const deleteOrganizationEventProposal = mutationField(
  "deleteOrganizationEventProposal",
  {
    type: DeleteOrganizationEventProposalResult,
    args: {
      input: arg({
        type: DeleteOrganizationEventProposalInput,
      }),
    },
    async resolve(root, args, ctx) {
      await deleteOrganizationEventProposalDb(args.input.eventProposalId);
      return { success: true };
    },
  }
);
