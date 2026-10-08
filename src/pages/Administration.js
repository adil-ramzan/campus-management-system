function Administration() {
    return (
      <div className="p-6 space-y-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-8">Administration</h1>

        <section id="vc-message" className="bg-white rounded-xl shadow-lg overflow-hidden">

          <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                <svg className="w-20 h-20 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Vice Chancellor's Message</h2>
                <p className="text-blue-100 mt-1">Prof. Dr. Shakeeb Ullah</p>
                <p className="text-blue-200 font-medium">Gomal University, Dera Ismail Khan</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="prose max-w-none text-gray-700">
              <p className="text-lg font-medium text-blue-800 mb-6">
                Taking the charge of Gomal University is a pleasant experience. This strategically unique – comprehensive university of KP (with all faculties – Science, Arts, Engineering, Pharmacy, Veterinary, Agriculture etc.) has enormous potentials including but not limited to hundreds of thousands of alumni all across the globe, diverse student population from all the provinces of Pakistan, highest student body from the former FATA region and the highest number of international students in any in land public sector university. The commitment of faculty members and students for attaining high standards of instructional environment is pleasantly amazing.
              </p>

              <div className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-600">
                <p className="mb-4">
                  I am writing to express my grave concern over the sudden and deadly outbreak of corona pandemic – COVID-19 and resultant disturbance, thereby caused, of all planned academic activities. Corona pandemic has not only affected Gomal University and our motherland but has also touched the whole humanity across the globe.
                </p>
                <p>
                  This is, no doubt, a hard time and Gomal family does feel the intense pain and is hopeful that this nightmare will be over soon.
                </p>
              </div>

              <p className="mb-6">
                The lockdowns and restrictions will be lifted and once people will be free to lead a normal routine life of their own. However, during these testing and demanding times, lives of many low paid/ daily wage-workers are in distress and they are hardly able to earn bread and butter. All such deserving and needy people need our special attention. We shall donate generously according to our religious teachings and Sunnah. So, please come forward and play your part selflessly, actively and vigorously; donate Zakat, Sadqaat and any other possible charity (ies) at this critical juncture. Moreover, the real motive and spirit shall be to serve our brethren and humanity without any ostentation. Allah, the Almighty will reward us all for this.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="font-medium text-blue-800">
                  The university is open to all, for suggestions and ideas to uplift the academic and research standards. We, all the stakeholders, envision bringing its level at par with the leading universities of the World within three year (In Sha'Allah).
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-right">
              <p className="text-gray-600 font-medium">Sincerely,</p>
              <p className="text-blue-800 font-bold text-lg">Prof. Dr. Shakeeb Ullah</p>
              <p className="text-gray-600">Vice-Chancellor</p>
              <p className="text-gray-500">Gomal University, Dera Ismail Khan</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  export default Administration;
