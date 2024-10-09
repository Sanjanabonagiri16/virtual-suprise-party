import React, { useEffect } from 'react';

export default function SurpriseCapsules() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('../public/capsules.js').then(module => {
        module.initCapsules();
      });
    }
  }, []);

  return (
    <>
      <div id="surpriseCapsules" className="surprise-capsules">
        <h2 className="capsules-header">Surprise Capsules for You 💌</h2>
        <div id="capsuleList" className="capsule-list"></div>
        <button id="addCapsuleButton" className="add-capsule-button">+</button>
      </div>

      <div id="newCapsuleModal" className="modal">
        <div className="modal-content">
          <span className="close">&times;</span>
          <h2>Create a New Surprise Capsule</h2>
          <form id="newCapsuleForm">
            <input type="text" id="capsuleTitle" placeholder="Capsule Title" required />
            <textarea id="capsuleMessage" placeholder="Write your message here..." required></textarea>
            <input type="file" id="capsuleImage" accept="image/*" />
            <input type="datetime-local" id="capsuleUnlockTime" required />
            <select id="capsuleShape" name="capsuleShape">
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="heart">Heart</option>
            </select>
            <button type="submit">Create Capsule</button>
          </form>
        </div>
      </div>
    </>
  );
}